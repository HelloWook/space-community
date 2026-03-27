import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface UseWASDControlsOptions {
  /** 이동 속도 (기본: 0.3) */
  speed?: number;
  /** 활성화 여부 (기본: true) */
  enabled?: boolean;
  /** 이동 범위 제한 */
  bounds?: {
    min: [number, number, number];
    max: [number, number, number];
  };
}

const INTERACTIVE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * WASD 카메라 이동 훅 — OrbitControls와 공존.
 * useFrame 내에서 매 프레임 카메라 위치를 업데이트한다.
 */
export function useWASDControls(options?: UseWASDControlsOptions) {
  const { speed = 0.3, enabled = true, bounds } = options ?? {};
  const { camera } = useThree();

  const keys = useRef({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에 포커스가 있으면 무시
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag && INTERACTIVE_TAGS.has(tag)) return;

      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = false;
      }
    };

    // 탭 전환 시 키 상태 초기화 — 키가 눌린 채로 탭 전환하면 stuck 방지
    const handleVisibilityChange = () => {
      if (document.hidden) {
        keys.current = { w: false, a: false, s: false, d: false };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();

  useFrame(() => {
    if (!enabled) return;

    const { w, a, s, d } = keys.current;
    if (!w && !a && !s && !d) return;

    // 카메라의 현재 방향 벡터 계산
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(forward, camera.up).normalize();

    // 이동 벡터 계산
    if (w) camera.position.addScaledVector(forward, speed);
    if (s) camera.position.addScaledVector(forward, -speed);
    if (d) camera.position.addScaledVector(right, speed);
    if (a) camera.position.addScaledVector(right, -speed);

    // 범위 제한 (bounds가 설정된 경우)
    if (bounds) {
      camera.position.x = Math.max(bounds.min[0], Math.min(bounds.max[0], camera.position.x));
      camera.position.y = Math.max(bounds.min[1], Math.min(bounds.max[1], camera.position.y));
      camera.position.z = Math.max(bounds.min[2], Math.min(bounds.max[2], camera.position.z));
    }
  });
}
