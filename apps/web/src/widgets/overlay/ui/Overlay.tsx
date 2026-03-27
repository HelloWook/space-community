'use client';

import { cn } from '@/shared/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/shadcn/dialog';

/** 크기 variant별 최대 너비 매핑 */
const sizeClasses = {
  sm: 'sm:max-w-md',   // ~448px — 로그인, 은하 생성
  lg: 'sm:max-w-2xl',  // ~672px — 게시글 상세
  xl: 'sm:max-w-5xl',  // ~1024px — 게시글 작성 (2단 레이아웃)
} as const;

interface OverlayProps {
  /** 오버레이 열림 상태 */
  open: boolean;
  /** 닫기 콜백 (ESC, 배경 클릭 시 호출) */
  onClose: () => void;
  /** 오버레이 제목 (선택) */
  title?: string;
  /** 오버레이 설명 (선택) */
  description?: string;
  /** 오버레이 내부 콘텐츠 */
  children: React.ReactNode;
  /** 추가 스타일 클래스 */
  className?: string;
  /** 크기 variant: sm(448px), lg(672px), xl(1024px) */
  size?: 'sm' | 'lg' | 'xl';
}

/** shadcn Dialog 기반 공통 오버레이 — 우주 테마 스타일 유지 */
export function Overlay({
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = 'sm',
}: OverlayProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent
        className={cn(
          // 기본 스타일 초기화 및 우주 테마 적용
          'max-h-[90vh] overflow-y-auto border-[hsl(var(--overlay-border)/0.2)] bg-[hsl(var(--card))] shadow-[0_0_30px_hsl(var(--glow-purple)/0.15)]',
          sizeClasses[size],
          className,
        )}
        // 오버레이 배경 우주 테마 스타일
        overlayClassName="bg-[hsl(var(--overlay-bg)/0.85)] backdrop-blur-md"
      >
        {/* 제목/설명이 있을 때만 헤더 렌더링 */}
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="text-foreground">{title}</DialogTitle>
            )}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {/* title 없을 때 접근성을 위한 숨김 제목 */}
        {!title && (
          <DialogTitle className="sr-only">오버레이</DialogTitle>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}
