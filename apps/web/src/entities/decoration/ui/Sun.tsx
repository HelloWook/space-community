'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunProps {
  /** 위치 */
  position: [number, number, number];
  /** 크기 (기본: 2) */
  scale?: number;
  /** 조명 강도 (기본: 1.5) */
  lightIntensity?: number;
  /** 발광 색상 (기본: '#ffaa33') */
  color?: string;
}

export function Sun({
  position,
  scale = 2,
  lightIntensity = 1.5,
  color = '#ffaa33',
}: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.1 * delta;
  });

  return (
    <group position={position}>
      {/* 태양 본체 */}
      <mesh ref={meshRef} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* 외부 글로우 */}
      <mesh scale={scale * 1.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* PointLight — 주변 조명 */}
      <pointLight
        color={color}
        intensity={lightIntensity}
        distance={50}
        decay={2}
      />
    </group>
  );
}
