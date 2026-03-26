'use client';

import { usePlanet } from '@/entities/planet';
import { CommentList } from '@/entities/comment';
import { GiveStarButton } from '@/features/give-star';
import { WriteCommentForm } from '@/features/write-comment';
import { Button } from '@/shared/ui/shadcn/button';

interface PostOverlayProps {
  /** 조회할 행성(게시글) ID */
  planetId: string;
  /** 오버레이 닫기 콜백 */
  onClose: () => void;
}

// 행성(게시글) 상세 오버레이 패널 — 3D 캔버스 위에 표시
export function PostOverlay({ planetId, onClose }: PostOverlayProps) {
  const { data: planet, isLoading, isError } = usePlanet(planetId);

  return (
    <div
      data-testid="post-overlay"
      className="fixed inset-y-0 right-0 w-[400px] bg-[rgba(10,10,30,0.92)] text-foreground p-6 overflow-y-auto z-[100] shadow-[-4px_0_20px_rgba(0,0,0,0.5)]"
    >
      {/* 닫기 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-4 right-4 text-2xl text-foreground hover:text-foreground/80"
      >
        ✕
      </Button>

      {/* 로딩 상태 */}
      {isLoading && <p>로딩 중...</p>}

      {/* 에러 상태 */}
      {isError && <p>게시글을 불러올 수 없습니다.</p>}

      {/* 게시글 상세 내용 */}
      {planet && (
        <>
          <h2 className="text-xl mb-2 mt-2">
            {planet.title}
          </h2>
          <div className="text-xs text-muted-foreground mb-4 flex gap-3">
            <span>{planet.authorNickname}</span>
            <span>{new Date(planet.createdAt).toLocaleDateString('ko-KR')}</span>
          </div>
          {/* 내용을 프리포맷 텍스트로 렌더링 (MVP) */}
          <pre
            data-testid="post-content"
            className="whitespace-pre-wrap break-words font-[inherit] text-sm leading-relaxed text-foreground/85"
          >
            {planet.content}
          </pre>

          {/* 별 주기 버튼 — 로그인 체크는 GiveStarButton 내부에서 처리 */}
          <GiveStarButton
            planetId={planetId}
            starCount={planet.starCount}
          />

          {/* 구분선 */}
          <hr className="border-none border-t border-border my-5" />

          {/* 댓글 작성 폼 */}
          <WriteCommentForm planetId={planetId} />

          {/* 댓글 목록 */}
          <div className="mt-4">
            <CommentList planetId={planetId} />
          </div>
        </>
      )}
    </div>
  );
}
