'use client';

import { useEffect, useState, useCallback } from 'react';

interface ControlsHUDProps {
  /** 외부에서 표시 여부 제어 */
  visible?: boolean;
}

const STORAGE_KEY = 'controls-hud-dismissed';

/**
 * 화면 하단 조작 안내 HUD.
 * 첫 인터랙션(keydown/mousedown) 후 3초 + 1초 페이드아웃.
 * 세션 스토리지에 표시 완료 저장 → 재방문 시 미표시.
 */
export function ControlsHUD({ visible: externalVisible }: ControlsHUDProps) {
  const [dismissed, setDismissed] = useState(true); // SSR 안전 기본값
  const [fadeOut, setFadeOut] = useState(false);

  // 클라이언트 마운트 시 세션 스토리지 확인
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    setDismissed(wasDismissed);
  }, []);

  const handleInteraction = useCallback(() => {
    // 이미 사라진 상태면 무시
    if (dismissed) return;

    // 3초 후 페이드아웃 시작
    setTimeout(() => {
      setFadeOut(true);
      // 1초 후 완전 숨김
      setTimeout(() => {
        setDismissed(true);
        sessionStorage.setItem(STORAGE_KEY, 'true');
      }, 1000);
    }, 3000);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) return;

    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('mousedown', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
    };
  }, [dismissed, handleInteraction]);

  // 외부 제어 또는 이미 해제됨
  if (externalVisible === false || dismissed) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none"
      style={{
        opacity: fadeOut ? 0 : 0.85,
        transition: 'opacity 1s ease-out',
      }}
    >
      <div className="bg-black/60 backdrop-blur-sm rounded-lg px-5 py-2.5 text-sm text-muted-foreground">
        <span className="text-foreground font-medium">WASD</span>: 이동 &nbsp;|&nbsp;{' '}
        <span className="text-foreground font-medium">마우스 드래그</span>: 회전 &nbsp;|&nbsp;{' '}
        <span className="text-foreground font-medium">스크롤</span>: 줌 &nbsp;|&nbsp;{' '}
        <span className="text-foreground font-medium">클릭</span>: 선택
      </div>
    </div>
  );
}
