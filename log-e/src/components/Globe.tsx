import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type GlobeProps = {
  rotationX?: number;
  rotationZ?: number;
  rotationYSpeed?: number;
  positionY?: number;
};

function Globe({ rotationX = 0.5, rotationZ = 0.41, rotationYSpeed = 0.05, positionY = -14.5 }: GlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Earth texture URL (using a reliable source)
  const earthTextureUrl = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg';
  // Cloud texture (2K) served from public assets
  const cloudTextureUrl = '/2k_earth_clouds.jpg';
  
  // Load texture using useTexture hook from drei
  const earthMap = useTexture(earthTextureUrl);
  const cloudMap = useTexture(cloudTextureUrl);

  // Rotate the globe slowly on Y-axis and add subtle horizon movement
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationYSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * (rotationYSpeed * 1.2); // Slightly faster for parallax depth
    }
    
    // Base tilt from Leva + subtle oscillation
    if (groupRef.current) {
      groupRef.current.rotation.x = rotationX + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
      groupRef.current.rotation.z = rotationZ + Math.cos(state.clock.elapsedTime * 0.25) * 0.015;
    }
  });

  // Position the globe at the bottom center, creating a horizon effect
  // Only the top portion will be visible
  return (
    <group ref={groupRef} position={[0, positionY, 0]}>
      {/* Main Earth Sphere */}
      <mesh ref={meshRef} scale={[15, 15, 15]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthMap}
          metalness={0.1}
          roughness={0.8}
          emissive="#000000"
        />
      </mesh>

      {/* Soft cloud layer for extra depth */}
      <mesh ref={cloudsRef} scale={[15.1, 15.1, 15.1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric Glow Effect (Fresnel-like) */}
      <mesh ref={atmosphereRef} scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#00f2ff"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default Globe;
