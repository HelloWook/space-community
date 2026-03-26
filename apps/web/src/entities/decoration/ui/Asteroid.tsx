'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AsteroidProps {
  /** 궤도 중심 */
  center: [number, number, number];
  /** 궤도 반경 */
  orbitRadius: number;
  /** 크기 (기본: 0.5) */
  scale?: number;
  /** 궤도 속도 (기본: 0.01) */
  orbitSpeed?: number;
}

export function Asteroid({
  center,
  orbitRadius,
  scale = 0.5,
  orbitSpeed = 0.01,
}: AsteroidProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    angleRef.current += orbitSpeed * delta * 60;
    meshRef.current.position.set(
      center[0] + Math.cos(angleRef.current) * orbitRadius,
      center[1] + Math.sin(angleRef.current * 0.7) * orbitRadius * 0.3,
      center[2] + Math.sin(angleRef.current) * orbitRadius,
    );
    meshRef.current.rotation.x += 0.005 * delta * 60;
    meshRef.current.rotation.y += 0.003 * delta * 60;
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#666666" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}
