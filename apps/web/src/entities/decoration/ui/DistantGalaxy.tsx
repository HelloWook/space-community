'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DistantGalaxyProps {
  /** 은하 위치 */
  position: [number, number, number];
  /** 은하 색상 (기본: '#aabbff') */
  color?: string;
  /** 크기 배율 (기본: 0.5) */
  scale?: number;
}

export function DistantGalaxy({
  position,
  color = '#aabbff',
  scale = 0.5,
}: DistantGalaxyProps) {
  const diskRef = useRef<THREE.Mesh>(null!);

  // 디스크 느린 회전
  useFrame((_, delta) => {
    if (!diskRef.current) return;
    diskRef.current.rotation.z += 0.002 * delta * 60;
  });

  return (
    <group position={position} scale={scale} raycast={null as unknown as THREE.Raycaster['intersectObject']}>
      {/* 중앙 발광 구체 */}
      <mesh>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 희미한 디스크 */}
      <mesh ref={diskRef} rotation-x={Math.PI * 0.33}>
        <ringGeometry args={[0.4, 1.2, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
