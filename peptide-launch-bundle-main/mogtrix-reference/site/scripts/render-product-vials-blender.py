import argparse
import math
import re
import sys
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_TS = ROOT / "lib" / "content" / "products.ts"
OUT_DIR = ROOT / "public" / "visuals" / "products" / "mogtrix-vials-v2"

WIDTH = 1200
HEIGHT = 1400
CAMERA_Y = -7.2
FRONT_Y = -1.24
VIAL_RADIUS = 1.08


def clean_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def set_bsdf_input(material, names, value):
    node = material.node_tree.nodes.get("Principled BSDF")
    if not node:
        return

    for name in names:
        if name in node.inputs:
            node.inputs[name].default_value = value
            return


def make_material(name, color, roughness=0.35, metallic=0.0, alpha=1.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = color
    set_bsdf_input(material, ["Base Color"], color)
    set_bsdf_input(material, ["Roughness"], roughness)
    set_bsdf_input(material, ["Metallic"], metallic)
    set_bsdf_input(material, ["Alpha"], alpha)
    set_bsdf_input(material, ["Transmission Weight", "Transmission"], 0.0)
    if alpha < 1:
        material.blend_method = "BLEND"
        material.use_screen_refraction = True
    else:
        material.blend_method = "OPAQUE"
        material.use_screen_refraction = False
    return material


def add_cylinder(name, radius, depth, z, material, vertices=128, bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=(0, 0, z),
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    bpy.ops.object.shade_smooth()

    if bevel:
        modifier = obj.modifiers.new(f"{name} bevel", "BEVEL")
        modifier.width = bevel
        modifier.segments = 10
        modifier.affect = "EDGES"
        obj.modifiers.new(f"{name} weighted normals", "WEIGHTED_NORMAL")

    return obj


def add_vial_mesh(material):
    # Revolved profile: squat 10ml reference vial proportions with a short
    # shoulder and compact body, closer to the uploaded MOGTRIX guide.
    profile = [
        (0.78, -1.42),
        (0.98, -1.38),
        (1.08, -1.26),
        (1.09, -1.02),
        (1.09, 0.24),
        (1.05, 0.39),
        (0.93, 0.51),
        (0.70, 0.63),
        (0.55, 0.80),
        (0.53, 1.12),
        (0.60, 1.22),
        (0.72, 1.25),
        (0.72, 1.32),
        (0.52, 1.35),
    ]
    segments = 160
    vertices = []
    faces = []

    for i in range(segments):
        angle = 2 * math.pi * i / segments
        x_mult = math.cos(angle)
        y_mult = math.sin(angle)
        for radius, z in profile:
            vertices.append((radius * x_mult, radius * y_mult, z))

    row = len(profile)
    for i in range(segments):
        ni = (i + 1) % segments
        for j in range(row - 1):
            faces.append((i * row + j, ni * row + j, ni * row + j + 1, i * row + j + 1))

    mesh = bpy.data.meshes.new("vial_glass_mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("vial_glass", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    obj.select_set(False)
    obj.modifiers.new("vial weighted normals", "WEIGHTED_NORMAL")
    return obj


def add_curved_label(material):
    # Cylindrical front segment. The side edges recede around the glass instead
    # of reading as a pasted-on flat rectangle.
    width = 1.86
    z_min = -0.66
    z_max = 0.58
    segments = 72
    vertices = []
    faces = []

    for i in range(segments + 1):
        t = i / segments
        x = -width / 2 + width * t
        y = -math.sqrt(max((VIAL_RADIUS + 0.012) ** 2 - x**2, 0.0)) - 0.01
        vertices.append((x, y, z_max))
        vertices.append((x, y, z_min))

    for i in range(segments):
        faces.append((i * 2, i * 2 + 1, i * 2 + 3, i * 2 + 2))

    mesh = bpy.data.meshes.new("label_wrap_mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("label_wrap_black", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    obj.select_set(False)
    return obj


def add_text(name, text, x, z, size, material, align="CENTER", weight=0.0):
    bpy.ops.object.text_add(location=(x, FRONT_Y, z), rotation=(math.radians(90), 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = text
    obj.data.align_x = align
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = 0.001
    obj.data.resolution_u = 16
    obj.data.shear = -0.12
    obj.data.materials.append(material)

    if weight:
        obj.scale.x = 1 + weight

    obj.visible_shadow = False
    return obj


def add_line(name, points, material, thickness=0.01):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 16
    curve.bevel_depth = thickness
    curve.bevel_resolution = 3
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)

    for point, coords in zip(spline.points, points):
        point.co = (coords[0], FRONT_Y - 0.01, coords[1], 1)

    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    obj.visible_shadow = False
    return obj


def add_rectangle(name, x1, z1, x2, z2, material, thickness=0.008):
    add_line(
        name,
        [(x1, z1), (x2, z1), (x2, z2), (x1, z2), (x1, z1)],
        material,
        thickness,
    )


def add_label_decoration(lime_dim):
    # Minimal molecular lines on the left.
    molecule = [
        [(-0.72, 0.20), (-0.64, 0.26), (-0.55, 0.20), (-0.55, 0.08), (-0.64, 0.02), (-0.72, 0.08), (-0.72, 0.20)],
        [(-0.55, 0.08), (-0.45, 0.14), (-0.35, 0.08), (-0.35, -0.04), (-0.45, -0.10), (-0.55, -0.04)],
        [(-0.55, -0.04), (-0.67, -0.14)],
    ]
    for index, points in enumerate(molecule):
        add_line(f"molecule_{index}", points, lime_dim, 0.004)

    # DNA hint on right edge.
    left = []
    right = []
    for i in range(58):
        t = i / 57
        z = 0.52 - 0.88 * t
        left.append((0.58 + 0.065 * math.sin(t * math.pi * 4), z))
        right.append((0.76 - 0.065 * math.sin(t * math.pi * 4), z))
    add_line("dna_left", left, lime_dim, 0.006)
    add_line("dna_right", right, lime_dim, 0.006)

    for i in range(7):
        t = i / 6
        z = 0.45 - 0.78 * t
        spread = 0.065 * math.sin(t * math.pi * 4)
        add_line("dna_rung_" + str(i), [(0.58 + spread, z), (0.76 - spread, z)], lime_dim, 0.0035)


def add_glass_highlights(highlight, cyan_highlight):
    add_line(
        "left_glass_highlight",
        [(-1.02, -1.10), (-1.05, -0.70), (-1.03, 0.20), (-0.90, 0.45)],
        highlight,
        0.012,
    )
    add_line(
        "right_glass_highlight",
        [(1.02, -1.08), (1.05, -0.50), (1.03, 0.20), (0.90, 0.48)],
        cyan_highlight,
        0.007,
    )
    add_line("bottom_glass_rim", [(-0.60, -1.30), (0.60, -1.30)], highlight, 0.01)


def strip_dose(name, vial_size):
    escaped = re.escape(vial_size).replace(r"\ ", r"\s*")
    stripped = re.sub(r"\s+" + escaped + r"$", "", name, flags=re.I)
    stripped = re.sub(r"\s+\d+(?:mg)(?:\s*/\s*\d+mg)?$", "", stripped, flags=re.I)
    return stripped.strip() or name


def product_lines(product_name):
    if len(product_name) <= 16:
        return [product_name.upper()]

    return [line.upper() for line in re.sub(r"\s+\+\s+", " +\n", product_name).split("\n")]


def add_label_text(product):
    white = bpy.data.materials["ink_white"]
    lime = bpy.data.materials["ink_lime"]
    lime_dim = bpy.data.materials["ink_lime_dim"]

    add_label_decoration(lime_dim)

    add_text("wordmark_mog", "MOG", -0.17, 0.38, 0.16, white, weight=0.08)
    add_text("wordmark_trix", "TRIX", 0.19, 0.38, 0.16, lime, weight=0.08)
    add_text("peptides", "P E P T I D E S", 0.02, 0.25, 0.048, lime)

    name = strip_dose(product["name"], product["vialSize"])
    lines = product_lines(name)
    if len(lines) == 1:
        add_text("product_name", lines[0], 0, 0.06, 0.17 if len(lines[0]) < 16 else 0.14, white, weight=0.05)
        dose_z = -0.16
    else:
        is_dense_label = len(lines) >= 3
        start = 0.13 if is_dense_label else 0.10
        text_size = 0.076 if is_dense_label else 0.098
        line_gap = 0.095 if is_dense_label else 0.12
        for index, line in enumerate(lines[:3]):
            add_text(f"product_name_{index}", line, 0, start - index * line_gap, text_size, white, weight=0.04)
        dose_z = -0.24 if is_dense_label else -0.20

    badge_width = 0.58 if len(product["vialSize"]) <= 8 else 0.82
    add_rectangle("dose_badge", -badge_width / 2, dose_z - 0.07, badge_width / 2, dose_z + 0.07, lime_dim, 0.005)
    add_text("dose", product["vialSize"], 0, dose_z, 0.105 if len(product["vialSize"]) <= 8 else 0.078, lime, weight=0.06)
    add_line("rule", [(-0.38, dose_z - 0.15), (0.38, dose_z - 0.15)], lime_dim, 0.0035)
    add_text("ruo", "RESEARCH USE ONLY", 0, dose_z - 0.22, 0.058, white, weight=0.04)
    add_text("lab", "FOR LABORATORY RESEARCH", 0, dose_z - 0.31, 0.043, white)


def make_scene(product):
    clean_scene()

    glass = make_material("glass", (0.88, 1.0, 0.98, 0.105), roughness=0.03, alpha=0.105)
    label = make_material("matte_black_label", (0.005, 0.006, 0.005, 1), roughness=0.74)
    powder = make_material("powder", (0.92, 0.89, 0.78, 1), roughness=0.9)
    green = make_material("green_flip_cap", (0.0, 0.45, 0.26, 1), roughness=0.32)
    silver = make_material("silver_crimp", (0.72, 0.72, 0.68, 1), roughness=0.18, metallic=0.55)
    black = make_material("cap_shadow", (0.01, 0.012, 0.011, 1), roughness=0.4)
    make_material("ink_white", (0.97, 0.98, 0.94, 1), roughness=0.45)
    make_material("ink_lime", (0.58, 0.78, 0.14, 1), roughness=0.36)
    make_material("ink_lime_dim", (0.35, 0.5, 0.08, 1), roughness=0.6)
    highlight = make_material("glass_highlight", (0.94, 1.0, 0.98, 0.34), roughness=0.12, alpha=0.34)
    cyan_highlight = make_material("cyan_glass_highlight", (0.28, 0.95, 0.88, 0.24), roughness=0.16, alpha=0.24)

    add_vial_mesh(glass)
    add_cylinder("powder_fill", 0.82, 0.34, -1.05, powder, vertices=128, bevel=0.04)
    add_curved_label(label)

    add_cylinder("neck_glass", 0.46, 0.44, 1.08, glass, vertices=128, bevel=0.022)
    add_cylinder("silver_crimp", 0.72, 0.24, 1.42, silver, vertices=128, bevel=0.048)
    add_cylinder("crimp_shadow", 0.70, 0.022, 1.29, black, vertices=128, bevel=0.01)
    add_cylinder("green_cap", 0.78, 0.20, 1.64, green, vertices=128, bevel=0.052)
    add_cylinder("cap_top_rim", 0.74, 0.03, 1.76, green, vertices=128, bevel=0.025)

    add_label_text(product)
    add_glass_highlights(highlight, cyan_highlight)

    bpy.ops.object.light_add(type="AREA", location=(0, -5, 4))
    key = bpy.context.object
    key.name = "large_softbox"
    key.data.energy = 520
    key.data.size = 4.8

    bpy.ops.object.light_add(type="AREA", location=(-3.2, -3.8, 1.0))
    left = bpy.context.object
    left.name = "left_strip"
    left.data.energy = 120
    left.data.size = 1.5

    bpy.ops.object.light_add(type="AREA", location=(3.2, -3.8, 1.1))
    right = bpy.context.object
    right.name = "right_strip"
    right.data.energy = 90
    right.data.size = 1.5

    bpy.ops.object.camera_add(location=(0, CAMERA_Y, 0.04), rotation=(math.radians(90), 0, 0))
    camera = bpy.context.object
    camera.name = "front_ortho_camera"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 3.82
    camera.data.lens = 80
    bpy.context.scene.camera = camera

    scene = bpy.context.scene
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        scene.render.engine = "BLENDER_EEVEE"

    scene.render.resolution_x = WIDTH
    scene.render.resolution_y = HEIGHT
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.compression = 100
    scene.view_settings.view_transform = "Filmic"
    scene.view_settings.look = "Medium High Contrast"
    scene.view_settings.exposure = 0
    scene.view_settings.gamma = 1


def extract_products():
    text = PRODUCTS_TS.read_text()
    products = []
    for block in re.findall(r"\{\s*slug:\s*\"[^\"]+\".*?\n\s*\}", text, flags=re.S):
        slug = re.search(r"slug:\s*\"([^\"]+)\"", block)
        name = re.search(r"name:\s*\"([^\"]+)\"", block)
        vial_size = re.search(r"vialSize:\s*\"([^\"]+)\"", block)
        if slug and name and vial_size:
            products.append(
                {
                    "slug": slug.group(1),
                    "name": name.group(1),
                    "vialSize": vial_size.group(1),
                }
            )
    return products


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", default="")
    parser.add_argument("--out-dir", default=str(OUT_DIR))
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []
    return parser.parse_args(argv)


def main():
    args = parse_args()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    products = extract_products()

    if args.only:
        products = [product for product in products if product["slug"] == args.only]

    if not products:
        raise RuntimeError("No matching products found.")

    for product in products:
        make_scene(product)
        out_path = out_dir / f"{product['slug']}.png"
        bpy.context.scene.render.filepath = str(out_path)
        bpy.ops.render.render(write_still=True)
        print(f"rendered {out_path}")


if __name__ == "__main__":
    main()
