'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlackHoleProps {
  /** 위치 */
  position: [number, number, number];
  /** 크기 (기본: 3) */
  scale?: number;
  /** 왜곡 강도 (기본: 0.5) */
  distortionStrength?: number;
}

export function BlackHole({
  position,
  scale = 3,
  distortionStrength = 0.5,
}: BlackHoleProps) {
  const diskRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (!diskRef.current) return;
    diskRef.current.rotation.z += 0.3 * delta * distortionStrength;
  });

  return (
    <group position={position}>
      {/* 중심 검정 구체 */}
      <mesh scale={scale * 0.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 강착 원반 (accretion disk) */}
      <mesh ref={diskRef} rotation={[Math.PI * 0.4, 0, 0]} scale={scale}>
        <torusGeometry args={[1.2, 0.15, 16, 64]} />
        <meshStandardMaterial
          color="#6633cc"
          emissive="#4422aa"
          emissiveIntensity={1.5 * distortionStrength}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 외부 글로우 링 */}
      <mesh rotation={[Math.PI * 0.4, 0, 0]} scale={scale * 1.3}>
        <torusGeometry args={[1.2, 0.05, 8, 64]} />
        <meshBasicMaterial
          color="#8855ff"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
