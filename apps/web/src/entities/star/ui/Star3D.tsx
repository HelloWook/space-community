'use client';

// Star3D 컴포넌트 — InstancedMesh로 행성 주변 별 렌더링
import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { InstancedMesh } from 'three';
import * as THREE from 'three';
import type { Position } from '@galaxy-board/types';

interface Star3DProps {
  /** 별 개수 (0~100) */
  count: number;
  /** 행성 중심 위치 */
  planetPosition: Position;
}

// 행성 주변에 별을 구 패턴으로 배치하는 3D 컴포넌트
export function Star3D({ count, planetPosition }: Star3DProps) {
  const meshRef = useRef<InstancedMesh>(null);

  // 각 별의 위치를 피보나치 구면 분포로 계산
  const positions = useMemo(() => {
    const result: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(count, 1));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      // 궤도 반경 (1.5 ~ 2.5)
      const radius = 1.5 + (i % 3) * 0.5;
      result.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ),
      );
    }
    return result;
  }, [count]);

  // 인스턴스 행렬 초기화
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    positions.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.scale.setScalar(0.05);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  // 전체 링 회전 애니메이션
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  // count가 0이면 아무것도 렌더링하지 않음
  if (count === 0) return null;

  return (
    <group position={[planetPosition.x, planetPosition.y, planetPosition.z]}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.8}
        />
      </instancedMesh>
    </group>
  );
}
