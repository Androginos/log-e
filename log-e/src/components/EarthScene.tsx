import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stars, Environment, OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
import Globe from './Globe';
import { useTracking } from '../context/TrackingContext';

function CameraController({
  fov,
  distanceOffset,
  isTrackingMode,
}: {
  fov: number;
  distanceOffset: number;
  isTrackingMode: boolean;
}) {
  const { camera } = useThree();
  const currentZ = useRef(20 + distanceOffset);
  const currentFov = useRef(fov);
  const targetZ = isTrackingMode ? 26 : 20 + distanceOffset;
  const targetFov = isTrackingMode ? 50 : fov;

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
    }
    camera.updateProjectionMatrix();
  }, [camera, fov]);

  useEffect(() => {
    if (isTrackingMode) {
      camera.position.set(0, 0, 26);
      camera.lookAt(0, 0, 0);
      currentZ.current = 26;
    }
  }, [isTrackingMode, camera]);

  useFrame(() => {
    currentZ.current += (targetZ - currentZ.current) * 0.08;
    currentFov.current += (targetFov - currentFov.current) * 0.08;
    if (!isTrackingMode) {
      camera.position.set(0, 5, currentZ.current);
      camera.lookAt(0, 0, 0);
    }
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = currentFov.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

function EarthScene() {
  const { isTrackingMode, activeRoute } = useTracking();

  const globeControls = useControls('Globe', {
    rotationX: { value: 0.21, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotation X' },
    rotationZ: { value: 0.0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotation Z' },
    rotationYSpeed: { value: 0.02, min: 0, max: 0.2, step: 0.005, label: 'Rotation Y' },
    positionY: { value: -14.5, min: -20, max: 0, step: 0.1, label: 'Position Y' },
  });

  const cameraControls = useControls('Camera', {
    fov: { value: 35, min: 15, max: 75, step: 1, label: 'FOV' },
    distanceOffset: { value: -8.1, min: -15, max: 4, step: 0.1, label: 'Mesafe' },
  });

  const routeControls = useControls('Route', {
    longitudeOffset: { value: 180, min: -180, max: 360, step: 15, label: 'Lng Offset' },
  });

  const lightingControls = useControls('Lighting', {
    ambientIntensity: { value: 0.3, min: 0, max: 2, step: 0.05, label: 'Ambient' },
    directionalIntensity: { value: 1.0, min: 0, max: 3, step: 0.1, label: 'Directional' },
  });

  return (
    <Canvas
      camera={{ position: [0, 5, 20], fov: cameraControls.fov }}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        precision: 'mediump',
      }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}
    >
      <Suspense fallback={null}>
        <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade={true} />

        <ambientLight intensity={lightingControls.ambientIntensity} />
        <directionalLight position={[10, 10, 5]} intensity={lightingControls.directionalIntensity} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <CameraController
          fov={cameraControls.fov}
          distanceOffset={cameraControls.distanceOffset}
          isTrackingMode={isTrackingMode}
        />

        {isTrackingMode && (
          <OrbitControls
            enableZoom={true}
            minDistance={12}
            maxDistance={35}
            enablePan={false}
            rotateSpeed={0.8}
            target={[0, 0, 0]}
          />
        )}

        <Globe
          {...globeControls}
          isTrackingMode={isTrackingMode}
          activeRoute={activeRoute}
          longitudeOffset={routeControls.longitudeOffset}
        />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

export default EarthScene;
