'use client';

import { useEffect, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';

interface OverlayProps {
  /** 오버레이 열림 상태 */
  open: boolean;
  /** 닫기 콜백 (ESC, 배경 클릭 시 호출) */
  onClose: () => void;
  /** 오버레이 제목 (선택) */
  title?: string;
  /** 오버레이 내부 콘텐츠 */
  children: React.ReactNode;
  /** 너비 커스터마이징 */
  className?: string;
}

export function Overlay({
  open,
  onClose,
  title,
  children,
  className,
}: OverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      data-testid="overlay-backdrop"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[hsl(var(--overlay-bg)/0.85)] backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          'relative w-[400px] max-h-[90vh] overflow-y-auto rounded-lg border border-[hsl(var(--overlay-border)/0.2)] bg-[hsl(var(--card))] p-6 shadow-[0_0_30px_hsl(var(--glow-purple)/0.15)] transition-transform duration-200',
          className,
        )}
      >
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
