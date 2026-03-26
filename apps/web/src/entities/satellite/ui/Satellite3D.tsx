'use client';

// Satellite3D 컴포넌트 — InstancedMesh로 행성 주변 댓글 위성 렌더링
import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { InstancedMesh } from 'three';
import * as THREE from 'three';
import type { Position } from '@galaxy-board/types';

interface SatelliteItem {
  id: string;
  parentId: string | null;
}

interface Satellite3DProps {
  /** 위성으로 표시할 댓글 배열 */
  comments: SatelliteItem[];
  /** 행성 중심 위치 */
  planetPosition: Position;
  /** 위성 클릭 콜백 */
  onSatelliteClick?: (commentId: string) => void;
  /** 현재 포커스된 댓글 ID — 해당 위성 펄싱 글로우 표시 */
  focusedCommentId?: string | null;
}

// 최상위 댓글: 은색 큐브, 답글: 연회색 작은 큐브
// 궤도 반경: 3.0~4.0 (별보다 바깥쪽)
export function Satellite3D({ comments, planetPosition, onSatelliteClick, focusedCommentId }: Satellite3DProps) {
  // 최상위 댓글과 답글 분리
  const topLevelComments = useMemo(() => comments.filter((c) => c.parentId === null), [comments]);
  const replyComments = useMemo(() => comments.filter((c) => c.parentId !== null), [comments]);

  const topMeshRef = useRef<InstancedMesh>(null);
  const replyMeshRef = useRef<InstancedMesh>(null);

  // 포커스된 위성의 인스턴스 인덱스를 미리 계산
  const focusedTopIndex = useMemo(
    () => (focusedCommentId ? topLevelComments.findIndex((c) => c.id === focusedCommentId) : -1),
    [focusedCommentId, topLevelComments],
  );
  const focusedReplyIndex = useMemo(
    () => (focusedCommentId ? replyComments.findIndex((c) => c.id === focusedCommentId) : -1),
    [focusedCommentId, replyComments],
  );

  // 최상위 댓글 위치 — 피보나치 구면 분포, 궤도 반경 3.0~4.0
  const topPositions = useMemo(() => {
    const result: THREE.Vector3[] = [];
    const count = topLevelComments.length;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(count, 1));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      // 궤도 반경 3.0 ~ 4.0
      const radius = 3.0 + (i % 3) * 0.5;
      result.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ),
      );
    }
    return result;
  }, [topLevelComments]);

  // 답글 위치 — 피보나치 구면 분포, 궤도 반경 3.2~3.8 (최상위보다 약간 안쪽)
  const replyPositions = useMemo(() => {
    const result: THREE.Vector3[] = [];
    const count = replyComments.length;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(count, 1));
      // 최상위 댓글과 각도 오프셋으로 겹침 방지
      const theta = Math.PI * (1 + Math.sqrt(5)) * i + Math.PI * 0.5;
      const radius = 3.2 + (i % 2) * 0.3;
      result.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ),
      );
    }
    return result;
  }, [replyComments]);

  // 최상위 댓글 인스턴스 행렬 초기화
  useEffect(() => {
    if (!topMeshRef.current) return;
    const dummy = new THREE.Object3D();
    topPositions.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.scale.setScalar(0.08);
      dummy.updateMatrix();
      topMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    topMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [topPositions]);

  // 답글 인스턴스 행렬 초기화
  useEffect(() => {
    if (!replyMeshRef.current) return;
    const dummy = new THREE.Object3D();
    replyPositions.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.scale.setScalar(0.05);
      dummy.updateMatrix();
      replyMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    replyMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [replyPositions]);

  // 별(0.3 rad/s)보다 약간 느린 회전 애니메이션 (0.2 rad/s)
  // 포커스된 위성은 scale 펄싱 + emissiveIntensity 증가로 강조
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (topMeshRef.current) {
      topMeshRef.current.rotation.y = t * 0.2;

      // 포커스된 최상위 댓글 위성 펄싱 스케일 애니메이션
      if (focusedTopIndex >= 0) {
        const dummy = new THREE.Object3D();
        const pos = topPositions[focusedTopIndex];
        const pulse = 1.0 + 0.5 * Math.sin(t * 4); // 0.5~1.5 배 스케일
        dummy.position.copy(pos);
        dummy.scale.setScalar(0.08 * pulse);
        dummy.updateMatrix();
        topMeshRef.current.setMatrixAt(focusedTopIndex, dummy.matrix);
        topMeshRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    if (replyMeshRef.current) {
      // 답글은 반대 방향으로 약간 다르게 회전
      replyMeshRef.current.rotation.y = t * -0.15;
      replyMeshRef.current.rotation.x = t * 0.05;

      // 포커스된 답글 위성 펄싱 스케일 애니메이션
      if (focusedReplyIndex >= 0) {
        const dummy = new THREE.Object3D();
        const pos = replyPositions[focusedReplyIndex];
        const pulse = 1.0 + 0.5 * Math.sin(t * 4);
        dummy.position.copy(pos);
        dummy.scale.setScalar(0.05 * pulse);
        dummy.updateMatrix();
        replyMeshRef.current.setMatrixAt(focusedReplyIndex, dummy.matrix);
        replyMeshRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  // 클릭 핸들러: instanceId로 해당 댓글 ID 조회
  const handleTopClick = (e: { instanceId?: number }) => {
    if (!onSatelliteClick || e.instanceId === undefined) return;
    const comment = topLevelComments[e.instanceId];
    if (comment) onSatelliteClick(comment.id);
  };

  const handleReplyClick = (e: { instanceId?: number }) => {
    if (!onSatelliteClick || e.instanceId === undefined) return;
    const comment = replyComments[e.instanceId];
    if (comment) onSatelliteClick(comment.id);
  };

  // 포커스 여부에 따른 emissiveIntensity 계산
  const topEmissiveIntensity = focusedTopIndex >= 0 ? 1.2 : 0.4;
  const replyEmissiveIntensity = focusedReplyIndex >= 0 ? 1.0 : 0.25;

  // 댓글이 없으면 아무것도 렌더링하지 않음
  if (comments.length === 0) return null;

  return (
    <group position={[planetPosition.x, planetPosition.y, planetPosition.z]}>
      {/* 최상위 댓글 위성 — 은색 큐브 */}
      {topLevelComments.length > 0 && (
        <instancedMesh
          ref={topMeshRef}
          args={[undefined, undefined, topLevelComments.length]}
          frustumCulled={false}
          onClick={handleTopClick}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#C0C0C0"
            emissive={focusedTopIndex >= 0 ? '#FFD700' : '#A0A0A0'}
            emissiveIntensity={topEmissiveIntensity}
            metalness={0.6}
            roughness={0.3}
          />
        </instancedMesh>
      )}

      {/* 답글 위성 — 연회색 작은 큐브 */}
      {replyComments.length > 0 && (
        <instancedMesh
          ref={replyMeshRef}
          args={[undefined, undefined, replyComments.length]}
          frustumCulled={false}
          onClick={handleReplyClick}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#E8E8E8"
            emissive={focusedReplyIndex >= 0 ? '#FFD700' : '#C8C8C8'}
            emissiveIntensity={replyEmissiveIntensity}
            metalness={0.4}
            roughness={0.5}
          />
        </instancedMesh>
      )}

      {/* 혜성 효과: 최상위 댓글 위성 뒤에 꼬리 표현 */}
      {topLevelComments.length > 0 &&
        topPositions.map((pos, i) => (
          <mesh key={`trail-${i}`} position={[pos.x * 0.98, pos.y * 0.98, pos.z * 0.98]}>
            {/* 행성 중심 반대 방향으로 약간 늘어난 얇은 타원체 */}
            <sphereGeometry args={[0.03, 4, 4]} />
            <meshBasicMaterial
              color="#C0C0C0"
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
    </group>
  );
}
