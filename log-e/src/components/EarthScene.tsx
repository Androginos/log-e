import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Globe from './Globe';

// Sabit sahne ayarları (ileride güncellemek için bu değerleri değiştir)
const GLOBE = {
  rotationX: 0.5,
  rotationZ: 0.76,
  rotationYSpeed: 0.02,
  positionY: -14.5,
} as const;
const CAMERA = { fov: 30, distanceOffset: -1.0 } as const;
const LIGHTING = { ambientIntensity: 0.3, directionalIntensity: 1.0 } as const;

function CameraController({ fov, distanceOffset }: { fov: number; distanceOffset: number }) {
  const { camera } = useThree();
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
    }
    camera.updateProjectionMatrix();
  }, [camera, fov]);
  useEffect(() => {
    camera.position.set(0, 5, 20 + distanceOffset);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, distanceOffset]);
  return null;
}

function EarthScene() {
  return (
    <Canvas
      camera={{ position: [0, 5, 20], fov: CAMERA.fov }}
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
        <ambientLight intensity={LIGHTING.ambientIntensity} />
        <directionalLight position={[10, 10, 5]} intensity={LIGHTING.directionalIntensity} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <CameraController fov={CAMERA.fov} distanceOffset={CAMERA.distanceOffset} />

        {/* The 3D Earth Globe */}
        <Globe {...GLOBE} />

        {/* Environment for reflections (optional) */}
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

export default EarthScene;
