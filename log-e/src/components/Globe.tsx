import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import RouteLine from './RouteLine';
import type { RoutePoint } from '../context/TrackingContext';

type GlobeProps = {
  rotationX?: number;
  rotationZ?: number;
  rotationYSpeed?: number;
  positionY?: number;
  isTrackingMode?: boolean;
  activeRoute?: { origin: RoutePoint; destination: RoutePoint; progress: number } | null;
  longitudeOffset?: number;
};

const LERP_FACTOR = 0.08;
const NORMAL_POS_Y = -14.5;
const TRACKING_POS_Y = 0;
const NORMAL_SCALE = 15;
const TRACKING_SCALE = 5.5;

function Globe({
  rotationX = 0.21,
  rotationZ = 0,
  rotationYSpeed = 0.02,
  positionY = -14.5,
  isTrackingMode = false,
  activeRoute = null,
  longitudeOffset = 180,
}: GlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const currentPosY = useRef(positionY);
  const currentScale = useRef(NORMAL_SCALE);
  const currentRotX = useRef(rotationX);
  const currentRotZ = useRef(rotationZ);

  useEffect(() => {
    currentPosY.current = positionY;
    currentScale.current = isTrackingMode ? TRACKING_SCALE : NORMAL_SCALE;
  }, [positionY, isTrackingMode]);

  const earthTextureUrl =
    'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg';
  const cloudTextureUrl = '/2k_earth_clouds.jpg';

  const earthMap = useTexture(earthTextureUrl);
  const cloudMap = useTexture(cloudTextureUrl);

  useFrame((state, delta) => {
    const targetPosY = isTrackingMode ? TRACKING_POS_Y : NORMAL_POS_Y;
    const targetScale = isTrackingMode ? TRACKING_SCALE : NORMAL_SCALE;
    const targetRotX = isTrackingMode ? 0.4 : rotationX;
    const targetRotZ = isTrackingMode ? -0.1 : rotationZ;

    currentPosY.current += (targetPosY - currentPosY.current) * LERP_FACTOR;
    currentScale.current += (targetScale - currentScale.current) * LERP_FACTOR;
    currentRotX.current += (targetRotX - currentRotX.current) * LERP_FACTOR;
    currentRotZ.current += (targetRotZ - currentRotZ.current) * LERP_FACTOR;

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * (isTrackingMode ? rotationYSpeed * 0.5 : rotationYSpeed);
      meshRef.current.scale.setScalar(currentScale.current);
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.x += delta * (rotationYSpeed * (isTrackingMode ? 0.6 : 1.2));
      cloudsRef.current.scale.setScalar(currentScale.current * 1.006);
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.scale.setScalar((currentScale.current / 15) * 1.02);
    }

    if (groupRef.current) {
      groupRef.current.position.y = currentPosY.current;
      groupRef.current.rotation.x =
        currentRotX.current + Math.sin(state.clock.elapsedTime * 0.3) * (isTrackingMode ? 0.01 : 0.02);
      groupRef.current.rotation.z =
        currentRotZ.current + Math.cos(state.clock.elapsedTime * 0.25) * (isTrackingMode ? 0.008 : 0.015);
    }
  });

  return (
    <group ref={groupRef} position={[0, currentPosY.current, 0]}>
      <mesh ref={meshRef} scale={[currentScale.current, currentScale.current, currentScale.current]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthMap}
          metalness={0.1}
          roughness={0.8}
          emissive="#000000"
        />
        {isTrackingMode && activeRoute && (
          <RouteLine
            origin={activeRoute.origin}
            destination={activeRoute.destination}
            progress={activeRoute.progress}
            sphereScale={1}
            longitudeOffset={longitudeOffset}
          />
        )}
      </mesh>

      <mesh
        ref={cloudsRef}
        scale={[currentScale.current * 1.006, currentScale.current * 1.006, currentScale.current * 1.006]}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh
        ref={atmosphereRef}
        scale={[(currentScale.current / 15) * 1.02, (currentScale.current / 15) * 1.02, (currentScale.current / 15) * 1.02]}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#00f2ff"
          transparent
          opacity={isTrackingMode ? 0.25 : 0.3}
          side={THREE.BackSide}
        />
      </mesh>

    </group>
  );
}

export default Globe;
