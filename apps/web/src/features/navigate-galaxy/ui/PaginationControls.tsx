'use client';

// 페이지네이션 컨트롤 컴포넌트 — 은하 뷰에서 페이지 이동 버튼 표시

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
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        gap: 8,
        padding: '8px 16px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* 이전 페이지 버튼 — onPrevPage가 있을 때만 표시 */}
      {onPrevPage && (
        <button
          onClick={onPrevPage}
          disabled={isLoading}
          style={{
            padding: '6px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: 13,
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          ← 이전 페이지
        </button>
      )}

      {/* 다음 페이지 버튼 — hasMore가 true일 때만 표시 */}
      {hasMore && (
        <button
          onClick={onNextPage}
          disabled={isLoading}
          style={{
            padding: '6px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: 13,
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          다음 페이지 →
        </button>
      )}
    </div>
  );
}
