'use client';

import { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { Position } from '@galaxy-board/types';

// 보간 속도 — 작을수록 느리고 부드러운 전환
const LERP_FACTOR = 0.05;
// 전환 완료 판정 거리 임계값
const ARRIVAL_THRESHOLD = 0.1;

// 우주 전체 뷰 카메라 기본 위치
const UNIVERSE_POSITION = new Vector3(0, 0, 50);

interface UseCameraTransitionOptions {
  /** 현재 뷰 모드 */
  viewMode: 'universe' | 'galaxy';
  /** 선택된 은하 위치 (galaxy 모드일 때 사용) */
  targetPosition?: Position | null;
}

/**
 * 카메라 전환 훅 — 우주 뷰와 은하 뷰 사이를 부드럽게 이동
 * OrbitControls를 전환 중 비활성화하기 위해 isTransitioning 반환
 */
export function useCameraTransition({
  viewMode,
  targetPosition,
}: UseCameraTransitionOptions) {
  const { camera } = useThree();
  const isTransitioning = useRef(false);

  // 목표 위치 계산
  const getTargetPosition = useCallback(() => {
    if (viewMode === 'galaxy' && targetPosition) {
      // 은하 위치에서 살짝 뒤로 빠진 카메라 위치
      return new Vector3(
        targetPosition.x,
        targetPosition.y + 5,
        targetPosition.z + 15,
      );
    }
    return UNIVERSE_POSITION;
  }, [viewMode, targetPosition]);

  useFrame(() => {
    const target = getTargetPosition();
    const distance = camera.position.distanceTo(target);

    if (distance > ARRIVAL_THRESHOLD) {
      // 부드러운 보간 이동
      camera.position.lerp(target, LERP_FACTOR);
      isTransitioning.current = true;
    } else {
      isTransitioning.current = false;
    }
  });

  return { isTransitioning: isTransitioning.current };
}
