import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { RoutePoint } from '../context/TrackingContext';

const UP = new THREE.Vector3(0, 1, 0);

function createLatLngConverter(lngOffset: number) {
  return (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const theta = ((90 - lat) * Math.PI) / 180;
    const phi = ((((lng + lngOffset) % 360) + 360) % 360) * (Math.PI / 180);
  const x = -radius * Math.cos(phi) * Math.sin(theta);
  const y = radius * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  };
}

function getGreatCirclePoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  segments: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const axis = new THREE.Vector3().crossVectors(start, end);
  const len = axis.length();
  if (len < 1e-10) return [start.clone()];
  axis.normalize();
  const angle = start.angleTo(end);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const currentAngle = angle * t;
    const point = start.clone().applyAxisAngle(axis, currentAngle);
    point.normalize().multiplyScalar(radius);
    points.push(point);
  }
  return points;
}

type RouteLineProps = {
  origin: RoutePoint;
  destination: RoutePoint;
  progress: number;
  sphereScale: number;
  longitudeOffset?: number;
};

function RouteLine({ origin, destination, progress, sphereScale, longitudeOffset = 180 }: RouteLineProps) {
  const cursorRef = useRef<THREE.Group>(null);
  const arrowRef = useRef<THREE.Mesh>(null);
  const animProgress = useRef(progress / 100);
  const pulseRef = useRef(0);

  const radius = 1.002;
  const latLngToVector3 = useMemo(() => createLatLngConverter(longitudeOffset), [longitudeOffset]);
  const startVec = useMemo(
    () => latLngToVector3(origin.lat, origin.lng, radius),
    [origin.lat, origin.lng, latLngToVector3]
  );
  const endVec = useMemo(
    () => latLngToVector3(destination.lat, destination.lng, radius),
    [destination.lat, destination.lng, latLngToVector3]
  );

  const linePoints = useMemo(() => {
    const segments = 64;
    const pts = getGreatCirclePoints(startVec, endVec, radius, segments);
    return pts.map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [startVec, endVec]);

  const traveledLinePoints = useMemo(() => {
    const segments = 64;
    const pts = getGreatCirclePoints(startVec, endVec, radius, segments);
    const t = progress / 100;
    const stopIdx = t <= 0 ? 0 : Math.max(1, Math.min(Math.ceil(t * segments), segments));
    return pts.slice(0, stopIdx + 1).map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [startVec, endVec, progress]);

  const dotPosition = useMemo(() => {
    const segments = 64;
    const pts = getGreatCirclePoints(startVec, endVec, radius, segments);
    const dotIndex = Math.min(Math.floor((progress / 100) * segments), segments);
    return pts[dotIndex] || pts[0];
  }, [startVec, endVec, progress]);

  useFrame((state, delta) => {
    animProgress.current += (progress / 100 - animProgress.current) * Math.min(delta * 3, 0.1);
    pulseRef.current += delta * 4;

    const segments = 64;
    const pts = getGreatCirclePoints(startVec, endVec, radius, segments);
    const idx = Math.min(Math.floor(animProgress.current * segments), segments - 1);
    const pos = pts[idx] || pts[0];
    const nextPos = pts[Math.min(idx + 1, segments)] || pts[segments];

    if (cursorRef.current) {
      cursorRef.current.position.copy(pos);
      const tangent = new THREE.Vector3()
        .subVectors(nextPos, pos)
        .normalize();
      if (tangent.lengthSq() > 0.0001) {
        const quat = new THREE.Quaternion().setFromUnitVectors(UP, tangent);
        cursorRef.current.quaternion.copy(quat);
      }
    }

    if (arrowRef.current) {
      const pulse = 0.92 + Math.sin(pulseRef.current) * 0.08;
      arrowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group scale={[sphereScale, sphereScale, sphereScale]}>
      <Line
        points={linePoints}
        color="#00f2ff"
        lineWidth={1.5}
        transparent
        opacity={0.5}
      />
      {traveledLinePoints.length >= 2 && (
        <Line
          points={traveledLinePoints}
          color="#00ffcc"
          lineWidth={2.2}
          transparent
          opacity={0.98}
        />
      )}
      <group ref={cursorRef} position={[dotPosition.x, dotPosition.y, dotPosition.z]}>
        <mesh>
          <sphereGeometry args={[0.012, 20, 20]} />
          <meshBasicMaterial color="#00ffcc" />
        </mesh>
        <mesh ref={arrowRef} position={[0, 0.04, 0]} scale={[1, 1, 1]}>
          <coneGeometry args={[0.028, 0.07, 16]} />
          <meshBasicMaterial color="#00ffcc" />
        </mesh>
      </group>
      <mesh position={[startVec.x, startVec.y, startVec.z]}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[endVec.x, endVec.y, endVec.z]}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color="#ff6b35" />
      </mesh>
    </group>
  );
}

export default RouteLine;
