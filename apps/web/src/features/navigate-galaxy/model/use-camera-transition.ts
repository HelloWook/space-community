'use client';

import { useRef, useCallback, useEffect } from 'react';
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
  /** 저장된 카메라 위치 (universe 복귀 시 사용) */
  savedPosition?: [number, number, number] | null;
}

/**
 * 카메라 전환 훅 — 우주 뷰와 은하 뷰 사이를 부드럽게 이동
 * OrbitControls를 전환 중 비활성화하기 위해 isTransitioning 반환
 *
 * hasArrived ref로 도착 후 lerp 중단 — WASD 이동과의 충돌 방지
 */
export function useCameraTransition({
  viewMode,
  targetPosition,
  savedPosition,
}: UseCameraTransitionOptions) {
  const { camera } = useThree();
  const isTransitioning = useRef(false);
  // 도착 여부 — true이면 새 전환이 트리거될 때까지 lerp 중단
  const hasArrived = useRef(false);

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
    // universe 모드: 저장된 위치가 있으면 사용, 없으면 기본 위치
    if (savedPosition) {
      return new Vector3(savedPosition[0], savedPosition[1], savedPosition[2]);
    }
    return UNIVERSE_POSITION;
  }, [viewMode, targetPosition, savedPosition]);

  // viewMode 또는 targetPosition 변경 시 hasArrived 리셋 — 새 전환 시작
  useEffect(() => {
    hasArrived.current = false;
  }, [viewMode, targetPosition]);

  useFrame(() => {
    // 이미 도착한 상태면 lerp 건너뛰기
    if (hasArrived.current) {
      isTransitioning.current = false;
      return;
    }

    const target = getTargetPosition();
    const distance = camera.position.distanceTo(target);

    if (distance > ARRIVAL_THRESHOLD) {
      // 부드러운 보간 이동
      camera.position.lerp(target, LERP_FACTOR);
      isTransitioning.current = true;
    } else {
      // 도착 완료 — 더 이상 lerp하지 않음
      hasArrived.current = true;
      isTransitioning.current = false;
    }
  });

  return { isTransitioning: isTransitioning.current };
}
