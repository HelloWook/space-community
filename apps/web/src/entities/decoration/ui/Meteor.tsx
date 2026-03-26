'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';

interface MeteorProps {
  /** 시작 위치 */
  startPosition: [number, number, number];
  /** 이동 방향 벡터 */
  direction: [number, number, number];
  /** 이동 속도 (기본: 0.5) */
  speed?: number;
  /** 꼬리 길이 (기본: 10) */
  trailLength?: number;
}

export function Meteor({
  startPosition,
  direction,
  speed = 0.5,
  trailLength = 10,
}: MeteorProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const dirVec = useMemo(
    () => new THREE.Vector3(...direction).normalize(),
    [direction],
  );
  const start = useMemo(
    () => new THREE.Vector3(...startPosition),
    [startPosition],
  );
  const distanceTraveled = useRef(0);
  const maxDistance = 80;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const step = speed * delta * 60;
    meshRef.current.position.addScaledVector(dirVec, step);
    distanceTraveled.current += step;

    if (distanceTraveled.current > maxDistance) {
      meshRef.current.position.copy(start);
      distanceTraveled.current = 0;
    }
  });

  return (
    <Trail
      width={0.3}
      length={trailLength}
      color="#88ccff"
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={startPosition}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          emissive="#88ccff"
          emissiveIntensity={2}
          color="#aaddff"
        />
      </mesh>
    </Trail>
  );
}
