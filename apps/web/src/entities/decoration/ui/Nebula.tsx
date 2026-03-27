'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NebulaProps {
  /** 성운 중심 위치 */
  position: [number, number, number];
  /** 성운 색상 (기본: '#8866cc') */
  color?: string;
  /** 구름 반경 (기본: 10) */
  size?: number;
  /** 파티클 수 (기본: 200) */
  count?: number;
  /** 투명도 (기본: 0.3) */
  opacity?: number;
}

export function Nebula({
  position,
  color = '#8866cc',
  size = 10,
  count = 200,
  opacity = 0.3,
}: NebulaProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const baseColor = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      // 구형 분포: 랜덤 방향 * 랜덤 반경
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * size;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // 기본 색상에 약간의 변형
      const variation = 0.15;
      col[i * 3] = Math.min(1, Math.max(0, baseColor.r + (Math.random() - 0.5) * variation));
      col[i * 3 + 1] = Math.min(1, Math.max(0, baseColor.g + (Math.random() - 0.5) * variation));
      col[i * 3 + 2] = Math.min(1, Math.max(0, baseColor.b + (Math.random() - 0.5) * variation));
    }

    return { positions: pos, colors: col };
  }, [color, size, count]);

  // 느린 Y축 회전
  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.001 * delta * 60;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        transparent
        opacity={opacity}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
}
