'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh } from 'three';
import type { PlanetShape, SurfacePattern } from '@galaxy-board/types';
import { createPlanetMaterial } from '@/shared/lib/shaders/planet-material';

interface PlanetPreview3DProps {
  /** 메인 색상 (HEX) */
  mainColor: string;
  /** 보조 색상 (HEX) */
  subColor: string;
  /** 크기 */
  size: string;
  /** 형태 */
  shape: string;
  /** 표면 패턴 */
  pattern: string;
  /** 고리 유무 */
  hasRing: boolean;
}

// 크기 → 반지름
const SIZE_SCALE: Record<string, number> = {
  SMALL: 0.8,
  MEDIUM: 1.2,
  LARGE: 1.6,
};

// 형태별 지오메트리 생성
function createGeometry(shape: PlanetShape, radius: number): THREE.BufferGeometry {
  switch (shape) {
    case 'BOX': return new THREE.BoxGeometry(radius * 1.6, radius * 1.6, radius * 1.6);
    case 'TETRAHEDRON': return new THREE.TetrahedronGeometry(radius);
    case 'OCTAHEDRON': return new THREE.OctahedronGeometry(radius);
    case 'DODECAHEDRON': return new THREE.DodecahedronGeometry(radius);
    case 'TORUS': return new THREE.TorusGeometry(radius, radius * 0.4, 16, 32);
    case 'CYLINDER': return new THREE.CylinderGeometry(radius, radius, radius * 2, 32);
    case 'CONE': return new THREE.ConeGeometry(radius, radius * 2, 32);
    case 'SPHERE':
    default: return new THREE.SphereGeometry(radius, 32, 32);
  }
}

// 미리보기용 3D 행성 메시 (자동 회전)
function PreviewMesh({ mainColor, subColor, size, shape, pattern, hasRing }: PlanetPreview3DProps) {
  const meshRef = useRef<Mesh>(null);
  const radius = SIZE_SCALE[size] ?? SIZE_SCALE.MEDIUM;

  const geometry = useMemo(
    () => createGeometry(shape as PlanetShape, radius),
    [shape, radius],
  );

  const material = useMemo(
    () => createPlanetMaterial(pattern as SurfacePattern, mainColor, subColor),
    [pattern, mainColor, subColor],
  );

  const ringGeometry = useMemo(() => {
    if (!hasRing) return null;
    return new THREE.TorusGeometry(radius * 1.6, radius * 0.1, 2, 64);
  }, [hasRing, radius]);

  // 자동 회전
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} />
      {ringGeometry && (
        <mesh geometry={ringGeometry} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial
            color={mainColor}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// 미리보기 전용 3D 컴포넌트 — Canvas + 단일 행성 + OrbitControls
export function PlanetPreview3D(props: PlanetPreview3DProps) {
  return (
    <div
      data-testid="planet-preview-3d"
      style={{
        width: '100%',
        height: '200px',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#0a0a1a',
      }}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <PreviewMesh {...props} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
