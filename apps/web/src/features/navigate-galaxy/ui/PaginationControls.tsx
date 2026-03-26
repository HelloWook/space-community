'use client';

// 페이지네이션 컨트롤 컴포넌트 — 은하 뷰에서 페이지 이동 버튼 표시

import { Button } from '@/shared/ui/shadcn/button';

interface PaginationControlsProps {
  /** 다음 페이지 존재 여부 */
  hasMore: boolean;
  /** 다음 페이지 이동 콜백 */
  onNextPage: () => void;
  /** 이전 페이지 이동 콜백 (첫 페이지가 아닌 경우) */
  onPrevPage?: () => void;
  /** 로딩 상태 */
  isLoading: boolean;
}

// 은하 뷰 하단 중앙에 위치하는 페이지 이동 컨트롤
export function PaginationControls({
  hasMore,
  onNextPage,
  onPrevPage,
  isLoading,
}: PaginationControlsProps) {
  // 이전 페이지와 다음 페이지 버튼이 모두 없으면 렌더링하지 않음
  if (!hasMore && !onPrevPage) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 p-2 px-4 bg-black/50 rounded-lg backdrop-blur-sm">
      {/* 이전 페이지 버튼 — onPrevPage가 있을 때만 표시 */}
      {onPrevPage && (
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={isLoading}
          className="bg-white/10 border-white/20 text-foreground text-[13px]"
        >
          ← 이전 페이지
        </Button>
      )}

      {/* 다음 페이지 버튼 — hasMore가 true일 때만 표시 */}
      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={isLoading}
          className="bg-white/10 border-white/20 text-foreground text-[13px]"
        >
          다음 페이지 →
        </Button>
      )}
    </div>
  );
}
