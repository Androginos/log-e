import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stars, Environment } from '@react-three/drei';
import { useControls } from 'leva';
import Globe from './Globe';

function CameraController({ fov, distanceOffset }: { fov: number; distanceOffset: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, fov]);
  useEffect(() => {
    camera.position.set(0, 5, 20 + distanceOffset);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, distanceOffset]);
  return null;
}

// 23.5 degrees in radians (Earth's axial tilt)
const EARTH_AXIAL_TILT = (23.5 * Math.PI) / 180;

function EarthScene() {
  const globeControls = useControls('Globe', {
    rotationX: {
      value: 0.5,
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
      label: 'Rotation X (tilt)',
    },
    rotationZ: {
      value: EARTH_AXIAL_TILT,
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
      label: 'Rotation Z (axial tilt)',
    },
    rotationYSpeed: {
      value: 0.05,
      min: 0,
      max: 0.2,
      step: 0.005,
      label: 'Rotation Y (spin speed)',
    },
    positionY: {
      value: -14.5,
      min: -20,
      max: 0,
      step: 0.1,
      label: 'Position Y',
    },
  });

  const cameraControls = useControls('Camera', {
    fov: {
      value: 30,
      min: 15,
      max: 75,
      step: 1,
      label: 'Field of View',
    },
    distanceOffset: {
      value: 0,
      min: -4,
      max: 4,
      step: 0.1,
      label: 'Mesafe (ileri/geri)',
    },
  });

  const lightingControls = useControls('Lighting', {
    ambientIntensity: {
      value: 0.3,
      min: 0,
      max: 2,
      step: 0.05,
      label: 'Ambient',
    },
    directionalIntensity: {
      value: 1,
      min: 0,
      max: 3,
      step: 0.1,
      label: 'Directional',
    },
  });

  return (
    <Canvas
      camera={{ position: [0, 5, 20], fov: cameraControls.fov }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        precision: "mediump",
      }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}
    >
      <Suspense fallback={null}>
        {/* Deep space background with stars */}
        <Stars
          radius={300}
          depth={60}
          count={5000}
          factor={7}
          saturation={0}
          fade={true}
        />

        {/* Lighting */}
        <ambientLight intensity={lightingControls.ambientIntensity} />
        <directionalLight position={[10, 10, 5]} intensity={lightingControls.directionalIntensity} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Camera FOV updater - Canvas camera is created once, we sync fov reactively */}
        <CameraController fov={cameraControls.fov} distanceOffset={cameraControls.distanceOffset} />

        {/* The 3D Earth Globe */}
        <Globe {...globeControls} />

        {/* Environment for reflections (optional) */}
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

export default EarthScene;
