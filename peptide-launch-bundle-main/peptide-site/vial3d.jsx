/* vial3d.jsx — premium GLB vial renderer for the existing VialMock API */
const { useRef: vfR, useEffect: vfE, useState: vfS } = React;

const VIAL_GLB_URL = '/assets/vial.glb';
const THREE_URL = 'https://esm.sh/three@0.160.0';
const GLTF_LOADER_URL = 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
const DRACO_LOADER_URL = 'https://esm.sh/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

let _threeKitPromise = null;
let _dracoLoader = null;
let _vialModelPromise = null;
let _studioEnvironment = null;
let _sharedMaterials = null;

function loadThreeKit() {
  if (_threeKitPromise) return _threeKitPromise;
  if (window.__vial3dThreeKit) return Promise.resolve(window.__vial3dThreeKit);

  // Babel standalone rewrites import(), so the CDN modules are loaded in a
  // tiny native module script that Babel never processes.
  _threeKitPromise = new Promise((resolve, reject) => {
    const readyEvent = 'vial3d:three-ready';
    const errorEvent = 'vial3d:three-error';
    const cleanup = () => {
      window.removeEventListener(readyEvent, onReady);
      window.removeEventListener(errorEvent, onError);
    };
    const onReady = () => {
      cleanup();
      window.__vial3dThreeKit.THREE.Cache.enabled = true;
      resolve(window.__vial3dThreeKit);
    };
    const onError = () => {
      cleanup();
      reject(window.__vial3dThreeError || new Error('Unable to load Three.js modules'));
    };

    window.addEventListener(readyEvent, onReady, { once: true });
    window.addEventListener(errorEvent, onError, { once: true });

    const script = document.createElement('script');
    script.type = 'module';
    script.dataset.vial3dThreeKit = 'true';
    script.textContent = `
      Promise.all([
        import('${THREE_URL}'),
        import('${GLTF_LOADER_URL}'),
        import('${DRACO_LOADER_URL}')
      ]).then(([THREE, gltfModule, dracoModule]) => {
        window.__vial3dThreeKit = {
          THREE,
          GLTFLoader: gltfModule.GLTFLoader,
          DRACOLoader: dracoModule.DRACOLoader
        };
        window.dispatchEvent(new CustomEvent('${readyEvent}'));
      }).catch((error) => {
        window.__vial3dThreeError = error;
        window.dispatchEvent(new CustomEvent('${errorEvent}'));
      });
    `;
    document.head.appendChild(script);
  });

  return _threeKitPromise;
}

function getDracoLoader(DRACOLoader) {
  if (_dracoLoader) return _dracoLoader;

  _dracoLoader = new DRACOLoader();
  _dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
  _dracoLoader.setDecoderConfig({ type: 'wasm' });
  return _dracoLoader;
}

function getStudioEnvironment(THREE) {
  if (_studioEnvironment) return _studioEnvironment;

  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 384;

  const ctx = canvas.getContext('2d');
  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0.0, '#f7fbff');
  bg.addColorStop(0.34, '#c8d4df');
  bg.addColorStop(0.62, '#202a34');
  bg.addColorStop(1.0, '#05080c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Softbox shapes create controlled highlights on glass without heavy assets.
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.ellipse(168, 92, 96, 52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(34,211,238,0.34)';
  ctx.beginPath();
  ctx.ellipse(590, 132, 112, 64, 0, 0, Math.PI * 2);
  ctx.fill();

  _studioEnvironment = new THREE.CanvasTexture(canvas);
  _studioEnvironment.mapping = THREE.EquirectangularReflectionMapping;
  _studioEnvironment.colorSpace = THREE.SRGBColorSpace;
  return _studioEnvironment;
}

function getVialMaterials(THREE) {
  if (_sharedMaterials) return _sharedMaterials;

  _sharedMaterials = {
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xdff8ff,
      roughness: 0.08,
      metalness: 0,
      transmission: 0.46,
      thickness: 0.42,
      ior: 1.45,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      side: THREE.DoubleSide,
      envMapIntensity: 2.1,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    }),
    powder: new THREE.MeshStandardMaterial({
      color: 0xfffbef,
      roughness: 0.92,
      metalness: 0,
    }),
    cap: new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
    }),
    crimp: new THREE.MeshPhysicalMaterial({
      color: 0xcfd8df,
      roughness: 0.24,
      metalness: 0.92,
      envMapIntensity: 1.35,
    }),
    cyan: new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      roughness: 0.28,
      metalness: 0.1,
      emissive: 0x0b8ea3,
      emissiveIntensity: 0.38,
    }),
  };

  return _sharedMaterials;
}

function buildPowderAndHardware(THREE, size) {
  const details = new THREE.Group();
  const mats = getVialMaterials(THREE);
  const radius = Math.max(size.x, size.z) * 0.19;
  const bodyBottom = -size.y * 0.44;
  const fillHeight = size.y * 0.095;
  const fillY = bodyBottom + fillHeight * 0.5;

  const glassBody = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.98, radius * 1.04, size.y * 0.58, 72, 1, true),
    mats.glass
  );
  glassBody.position.y = -size.y * 0.12;
  glassBody.renderOrder = 4;
  details.add(glassBody);

  // Powder sits inside the transparent body so the vial reads as filled glass.
  const powder = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.82, radius * 0.9, fillHeight, 64, 1),
    mats.powder
  );
  powder.position.y = fillY;
  powder.renderOrder = 7;
  details.add(powder);

  const powderTop = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.86, 56, 12, 0, Math.PI * 2, 0, Math.PI * 0.45),
    mats.powder
  );
  powderTop.scale.y = 0.08;
  powderTop.position.y = fillY + fillHeight * 0.5 + size.y * 0.002;
  powderTop.renderOrder = 8;
  details.add(powderTop);

  // The GLB has one material, so these simple overlays keep cap/crimp readable
  // after the original mesh is turned into glass.
  const capY = size.y * 0.455;
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.14, radius * 1.06, size.y * 0.14, 64),
    mats.cap
  );
  cap.position.y = capY;
  cap.renderOrder = 9;
  details.add(cap);

  const capTop = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.14, 64, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
    mats.cap
  );
  capTop.scale.y = 0.18;
  capTop.position.y = capY + size.y * 0.07;
  capTop.renderOrder = 10;
  details.add(capTop);

  const crimp = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.09, radius * 1.09, size.y * 0.07, 64),
    mats.crimp
  );
  crimp.position.y = size.y * 0.35;
  crimp.renderOrder = 5;
  details.add(crimp);

  const cyanBand = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.06, radius * 1.06, size.y * 0.018, 64),
    mats.cyan
  );
  cyanBand.position.y = size.y * 0.305;
  cyanBand.renderOrder = 6;
  details.add(cyanBand);

  // Thin glass rim highlights make the transparency intentional, not washed out.
  const rimMat = mats.glass;
  [-0.31, 0.14].forEach((y) => {
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.98, radius * 0.025, 8, 64),
      rimMat
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = size.y * y;
    rim.renderOrder = 6;
    details.add(rim);
  });

  const highlightMat = new THREE.MeshBasicMaterial({
    color: 0xeaffff,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  [-0.42, 0.42].forEach((x) => {
    const highlight = new THREE.Mesh(
      new THREE.BoxGeometry(radius * 0.024, size.y * 0.46, radius * 0.02),
      highlightMat
    );
    highlight.position.set(radius * x, -size.y * 0.08, radius * 0.98);
    highlight.renderOrder = 7;
    details.add(highlight);
  });

  return details;
}

function prepareModel(THREE, scene) {
  const model = scene.clone(true);
  const mats = getVialMaterials(THREE);

  model.traverse((child) => {
    if (!child.isMesh) return;

    child.frustumCulled = true;
    child.material = mats.glass;
    child.renderOrder = 3;
  });

  // Normalize the GLB once so every card can use the same camera framing.
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const targetHeight = 2.12;
  const scale = targetHeight / Math.max(size.y, 0.001);

  const pivot = new THREE.Group();
  model.position.sub(center);
  pivot.scale.setScalar(scale);
  pivot.add(buildPowderAndHardware(THREE, size));
  pivot.add(model);
  return pivot;
}

function loadVialModel(THREE, GLTFLoader, DRACOLoader) {
  if (!_vialModelPromise) {
    _vialModelPromise = new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.setCrossOrigin('anonymous');
      loader.setDRACOLoader(getDracoLoader(DRACOLoader));
      loader.load(
        VIAL_GLB_URL,
        (gltf) => resolve(gltf.scene || gltf.scenes[0]),
        undefined,
        reject
      );
    });
  }

  return _vialModelPromise.then((sourceScene) => prepareModel(THREE, sourceScene));
}

function Vial3D({ label = 'SEMAX', code = 'VC-014', mass = '10 mg' }) {
  const wrap = vfR();
  const canvasRef = vfR();
  const stateRef = vfR({});
  const [failed, setFailed] = vfS(false);

  vfE(() => {
    let cancelled = false;
    let ro = null;
    let io = null;

    (async () => {
      try {
        const { THREE, GLTFLoader, DRACOLoader } = await loadThreeKit();
        if (cancelled) return;

        const canvas = canvasRef.current;
        const host = wrap.current;
        if (!canvas || !host) return;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.06;

        const scene = new THREE.Scene();
        scene.environment = getStudioEnvironment(THREE);

        const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 50);
        camera.position.set(0, 0.08, 6.15);
        camera.lookAt(0, 0, 0);

        const vial = await loadVialModel(THREE, GLTFLoader, DRACOLoader);
        if (cancelled) {
          renderer.dispose();
          return;
        }

        scene.add(vial);

        // Small, soft lighting stack. The GLB and environment map do most of the work.
        const key = new THREE.DirectionalLight(0xffffff, 1.25);
        key.position.set(3.2, 4.5, 5.0);
        scene.add(key);

        const cyanRim = new THREE.DirectionalLight(0x22d3ee, 0.76);
        cyanRim.position.set(-3.5, 1.7, -3.0);
        scene.add(cyanRim);

        scene.add(new THREE.HemisphereLight(0xddefff, 0x05080c, 1.05));

        const resize = () => {
          const r = host.getBoundingClientRect();
          const w = Math.max(1, Math.floor(r.width));
          const h = Math.max(1, Math.floor(r.height));
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };

        resize();
        if (window.ResizeObserver) {
          ro = new ResizeObserver(resize);
          ro.observe(host);
        } else {
          window.addEventListener('resize', resize);
        }

        let inView = true;
        if (window.IntersectionObserver) {
          io = new IntersectionObserver((entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
          }, { rootMargin: '180px' });
          io.observe(host);
        }

        let hovering = false;
        let easedY = 0;
        let easedX = 0;
        let easedLift = 0;
        const phase = code.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) * 0.013;
        const hoverY = THREE.MathUtils.degToRad(11);
        const hoverX = THREE.MathUtils.degToRad(-2.4);
        const hoverLift = 0.11;

        const onPointerEnter = () => {
          hovering = true;
        };
        const onPointerLeave = () => {
          hovering = false;
        };

        const card = host.closest('.card-hover, a[href]');
        const hoverTarget = card || host;
        hoverTarget.addEventListener('pointerenter', onPointerEnter);
        hoverTarget.addEventListener('pointerleave', onPointerLeave);

        let raf = 0;
        const animate = () => {
          const t = performance.now() * 0.001 + phase;

          easedY += ((hovering ? hoverY : 0) - easedY) * 0.08;
          easedX += ((hovering ? hoverX : 0) - easedX) * 0.08;
          easedLift += ((hovering ? hoverLift : 0) - easedLift) * 0.08;

          const idleFloat = Math.sin(t * 1.18) * 0.025;
          const idleY = Math.sin(t * 0.32) * 0.035;
          const idleX = Math.sin(t * 0.42) * 0.01;

          vial.position.y = easedLift + idleFloat;
          vial.rotation.x = easedX + idleX;
          vial.rotation.y = easedY + idleY;

          if (inView) renderer.render(scene, camera);
          raf = requestAnimationFrame(animate);
        };
        animate();

        stateRef.current = {
          dispose: () => {
            cancelAnimationFrame(raf);
            ro?.disconnect();
            io?.disconnect();
            if (!window.ResizeObserver) window.removeEventListener('resize', resize);
            hoverTarget.removeEventListener('pointerenter', onPointerEnter);
            hoverTarget.removeEventListener('pointerleave', onPointerLeave);
            scene.remove(vial);
            renderer.dispose();
          },
        };
      } catch (err) {
        console.warn('Unable to load /assets/vial.glb', err);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      stateRef.current?.dispose?.();
    };
  }, [code]);

  return (
    <div
      ref={wrap}
      aria-label={`${label} ${mass} vial render`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: 'var(--r-sm)',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 50% 38%, rgba(220,252,255,0.12), transparent 19%),
          radial-gradient(ellipse at 50% 78%, rgba(34,211,238,0.18), transparent 44%),
          linear-gradient(180deg, rgba(12,20,31,0.98), rgba(3,7,12,0.98))
        `,
        border: '1px solid color-mix(in oklab, var(--accent-hi) 20%, transparent)',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(90deg, transparent 0 42%, rgba(230,250,255,0.06) 42% 43%, transparent 43% 57%, rgba(230,250,255,0.05) 57% 58%, transparent 58%),
          repeating-linear-gradient(0deg, transparent 0 18px, rgba(148,221,232,0.035) 18px 19px)
        `,
        maskImage: 'radial-gradient(ellipse at 50% 48%, black 0 42%, transparent 72%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        left: '18%',
        right: '18%',
        bottom: '13%',
        height: '16%',
        borderRadius: '999px',
        background: 'radial-gradient(ellipse, rgba(34,211,238,0.30), rgba(6,10,16,0.34) 48%, transparent 72%)',
        filter: 'blur(8px)',
        opacity: 0.72,
        pointerEvents: 'none',
      }} />
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', position: 'relative', zIndex: 1 }} />
      {failed && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--fg-subtle)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          vial unavailable
        </div>
      )}
      <div style={{
        position: 'absolute',
        bottom: 6,
        left: 8,
        right: 8,
        zIndex: 2,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'rgba(226,244,248,0.68)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}>
        <span>{code}</span>
        <span>{mass}</span>
      </div>
    </div>
  );
}

window.VialMock = Vial3D;
window.Vial3D = Vial3D;
