"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";

function VialModel() {
  const gltf = useGLTF("/vials/vial.glb");
  return <primitive object={gltf.scene} scale={2.6} position={[0, -0.35, 0]} />;
}

export function VialScene() {
  return (
    <Canvas aria-label="Interactive 3D model of Mogtrix vial" camera={{ position: [0, 0.4, 5.2], fov: 36 }} dpr={[1, 1.6]}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 3, 4]} intensity={2.2} color="#b4ff2e" />
      <directionalLight position={[-3, 1, 2]} intensity={1.1} color="#ffb04f" />
      <Float speed={1.6} rotationIntensity={0.55} floatIntensity={0.55}>
        <VialModel />
      </Float>
      <Environment preset="night" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
    </Canvas>
  );
}
