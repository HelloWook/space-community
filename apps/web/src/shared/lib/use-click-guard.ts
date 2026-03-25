import { useCallback, useRef } from 'react';

// 드래그와 클릭을 구분하기 위한 거리 임계값 (px)
const THRESHOLD = 5;

interface PointerPosition {
  x: number;
  y: number;
}

/**
 * 드래그와 클릭을 구분하는 훅
 * pointerDown 위치와 pointerUp 위치의 차이가 THRESHOLD(5px) 이상이면 드래그로 판정
 */
export function useClickGuard() {
  const downPos = useRef<PointerPosition | null>(null);
  const clickFlag = useRef(false);

  // pointerDown 시 시작 위치 기록
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    downPos.current = { x: e.clientX, y: e.clientY };
    clickFlag.current = false;
  }, []);

  // pointerUp 시 이동 거리 계산하여 클릭 여부 판정
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!downPos.current) {
      clickFlag.current = false;
      return;
    }

    const dx = e.clientX - downPos.current.x;
    const dy = e.clientY - downPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    clickFlag.current = distance < THRESHOLD;
    downPos.current = null;
  }, []);

  // 마지막 포인터 이벤트가 클릭이었는지 반환
  const isClick = useCallback(() => clickFlag.current, []);

  return { onPointerDown, onPointerUp, isClick };
}
