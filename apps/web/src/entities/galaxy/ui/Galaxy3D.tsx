'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh } from 'three';
import type { Galaxy } from '@galaxy-board/types';

interface Galaxy3DProps {
  /** 은하 데이터 */
  galaxy: Galaxy;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 선택 상태 */
  isSelected?: boolean;
}

// 은하를 나타내는 3D 메시 — 토러스(원반) 형태 + 중심 구체 + 이름 레이블
export function Galaxy3D({ galaxy, onClick, isSelected }: Galaxy3DProps) {
  const groupRef = useRef<Mesh>(null);

  // 천천히 회전하는 애니메이션
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // 은하 크기 — 행성 수에 따라 약간 차이
  const scale = 1 + Math.min(galaxy.planetCount * 0.05, 0.5);
  // 선택 시 발광 색상 강조
  const emissiveIntensity = isSelected ? 0.8 : 0.3;

  return (
    <group position={[galaxy.position.x, galaxy.position.y, galaxy.position.z]}>
      <mesh ref={groupRef} onClick={onClick}>
        {/* 원반형 은하 형태 — 토러스 지오메트리 */}
        <torusGeometry args={[scale * 1.5, scale * 0.3, 16, 48]} />
        <meshStandardMaterial
          color="#6688ff"
          emissive="#4466dd"
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 은하 중심부 구체 */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[scale * 0.5, 24, 24]} />
        <meshStandardMaterial
          color="#aaccff"
          emissive="#6688ff"
          emissiveIntensity={emissiveIntensity + 0.2}
        />
      </mesh>

      {/* 은하 이름 레이블 */}
      <Html
        center
        distanceFactor={20}
        style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          textShadow: '0 0 8px rgba(100, 130, 255, 0.8)',
          userSelect: 'none',
        }}
        position={[0, scale * 2.2, 0]}
      >
        {galaxy.name}
      </Html>
    </group>
  );
}
