'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh } from 'three';
import type { PlanetSummary } from '@galaxy-board/types';
import { useClickGuard } from '@/shared/lib';

interface Planet3DProps {
  /** 행성(게시글) 요약 데이터 */
  planet: PlanetSummary;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

// starCount에 따른 행성 색상 결정
function getPlanetColor(starCount: number): string {
  if (starCount >= 10) return '#ffcc44'; // 인기 행성 — 금색
  if (starCount >= 5) return '#44ccff';  // 중간 — 하늘색
  return '#88aacc';                       // 기본 — 연한 파랑
}

// 행성을 나타내는 3D 구체 메시 — starCount에 따라 크기/색상 변화
export function Planet3D({ planet, onClick }: Planet3DProps) {
  const meshRef = useRef<Mesh>(null);
  const { onPointerDown, onPointerUp, isClick } = useClickGuard();

  // starCount에 비례한 크기 (최소 0.4, 최대 1.2)
  const radius = 0.4 + Math.min(planet.starCount * 0.08, 0.8);
  const color = getPlanetColor(planet.starCount);

  // 부드러운 상하 부유 애니메이션
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      // 각 행성마다 약간 다른 위상으로 부유
      meshRef.current.position.y =
        planet.position.y + Math.sin(t * 0.8 + planet.position.x) * 0.15;
    }
  });

  // 클릭 가드를 통한 클릭 처리 (드래그 시 무시)
  const handleClick = () => {
    if (isClick()) {
      onClick?.();
    }
  };

  return (
    <group position={[planet.position.x, planet.position.y, planet.position.z]}>
      <mesh
        ref={meshRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={handleClick}
      >
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2 + Math.min(planet.starCount * 0.05, 0.4)}
        />
      </mesh>

      {/* 행성 이름 레이블 */}
      <Html
        center
        distanceFactor={15}
        style={{
          color: 'white',
          fontSize: '12px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          textShadow: '0 0 6px rgba(0, 0, 0, 0.8)',
          userSelect: 'none',
        }}
        position={[0, radius + 0.6, 0]}
      >
        {planet.title}
      </Html>
    </group>
  );
}
