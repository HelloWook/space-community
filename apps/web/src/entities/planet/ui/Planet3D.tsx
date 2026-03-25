'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh } from 'three';
import type { PlanetSummary, PlanetShape } from '@galaxy-board/types';
import { useClickGuard } from '@/shared/lib';
import { createPlanetMaterial } from '@/shared/lib/shaders/planet-material';
import type { SurfacePattern } from '@galaxy-board/types';

interface Planet3DProps {
  /** 행성(게시글) 요약 데이터 */
  planet: PlanetSummary;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

// 크기 enum → 3D 반지름 매핑
const SIZE_SCALE: Record<string, number> = {
  SMALL: 0.3,
  MEDIUM: 0.6,
  LARGE: 1.0,
};

// 형태별 Three.js 지오메트리 생성
function createGeometry(shape: PlanetShape, radius: number): THREE.BufferGeometry {
  switch (shape) {
    case 'BOX':
      return new THREE.BoxGeometry(radius * 1.6, radius * 1.6, radius * 1.6);
    case 'TETRAHEDRON':
      return new THREE.TetrahedronGeometry(radius);
    case 'OCTAHEDRON':
      return new THREE.OctahedronGeometry(radius);
    case 'DODECAHEDRON':
      return new THREE.DodecahedronGeometry(radius);
    case 'TORUS':
      return new THREE.TorusGeometry(radius, radius * 0.4, 16, 32);
    case 'CYLINDER':
      return new THREE.CylinderGeometry(radius, radius, radius * 2, 32);
    case 'CONE':
      return new THREE.ConeGeometry(radius, radius * 2, 32);
    case 'SPHERE':
    default:
      return new THREE.SphereGeometry(radius, 32, 32);
  }
}

// 행성을 나타내는 3D 메시 — 커스터마이징 외형으로 렌더링
export function Planet3D({ planet, onClick }: Planet3DProps) {
  const meshRef = useRef<Mesh>(null);
  const { onPointerDown, onPointerUp, isClick } = useClickGuard();

  // 크기 계산
  const radius = SIZE_SCALE[planet.size] ?? SIZE_SCALE.MEDIUM;

  // 지오메트리 메모이제이션
  const geometry = useMemo(
    () => createGeometry(planet.shape as PlanetShape, radius),
    [planet.shape, radius],
  );

  // 셰이더 Material 메모이제이션
  const material = useMemo(
    () => createPlanetMaterial(
      planet.pattern as SurfacePattern,
      planet.mainColor,
      planet.subColor,
    ),
    [planet.pattern, planet.mainColor, planet.subColor],
  );

  // 고리 지오메트리
  const ringGeometry = useMemo(() => {
    if (!planet.hasRing) return null;
    return new THREE.TorusGeometry(radius * 1.6, radius * 0.1, 2, 64);
  }, [planet.hasRing, radius]);

  // 부드러운 상하 부유 + 자전 애니메이션
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y =
        planet.position.y + Math.sin(t * 0.8 + planet.position.x) * 0.15;
      meshRef.current.rotation.y += 0.003;
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
        geometry={geometry}
        material={material}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={handleClick}
      />

      {/* 고리 */}
      {ringGeometry && (
        <mesh
          geometry={ringGeometry}
          rotation={[Math.PI / 2.5, 0, 0]}
        >
          <meshStandardMaterial
            color={planet.mainColor}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

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
