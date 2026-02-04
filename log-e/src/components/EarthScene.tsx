import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Environment } from '@react-three/drei';
import Globe from './Globe';
import * as THREE from 'three';

function EarthScene() {
  return (
    <Canvas
      camera={{ position: [0, 5, 20], fov: 30 }}
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
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* The 3D Earth Globe */}
        <Globe />

        {/* Environment for reflections (optional) */}
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

export default EarthScene;
