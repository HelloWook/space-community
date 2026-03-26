'use client';

// 댓글 목록 컴포넌트 — 행성(게시글)의 모든 최상위 댓글 표시
import { useComments } from '../api/hooks';
import { useCommentFocusStore } from '../model/comment-focus-store';
import { useEffect, useRef, useState } from 'react';
import type { CommentResponse } from '@galaxy-board/types';
import { WriteCommentForm } from '@/features/write-comment';
import { Button } from '@/shared/ui/shadcn/button';
import { Card } from '@/shared/ui/shadcn/card';

interface CommentListProps {
  /** 조회할 Planet ID */
  planetId: string;
}

interface CommentItemProps {
  comment: CommentResponse;
  planetId: string;
  isFocused: boolean;
  onFocus: (commentId: string) => void;
}

/** 개별 댓글 카드 (최상위 댓글) */
function CommentItem({ comment, planetId, isFocused, onFocus }: CommentItemProps) {
  // 답글 폼 열림 여부 (최상위 댓글만 가짐)
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  return (
    <Card
      data-comment-id={comment.id}
      onClick={() => onFocus(comment.id)}
      className={`p-3 mb-2 cursor-pointer transition-colors duration-200 border-l-[3px] ${
        isFocused
          ? 'bg-[#1e2a45] border-l-primary'
          : 'bg-card border-l-transparent'
      }`}
    >
      {/* 댓글 헤더: 닉네임 + 날짜 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#90caf9] text-[13px] font-bold">
          {comment.authorNickname}
        </span>
        <span className="text-muted-foreground text-[11px]">
          {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>

      {/* 댓글 내용 */}
      <p className="text-foreground/85 text-[13px] leading-relaxed m-0 whitespace-pre-wrap break-words">
        {comment.content}
      </p>

      {/* 답글 버튼 (최상위 댓글만) */}
      <div className="mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            // 클릭 이벤트가 상위 div 포커스 핸들러까지 전파되지 않도록 방지
            e.stopPropagation();
            setShowReplyForm((prev) => !prev);
          }}
          aria-label={showReplyForm ? '답글 폼 닫기' : '답글 작성'}
          className="h-6 px-2 text-[11px] text-muted-foreground"
        >
          {showReplyForm ? '취소' : '답글'}
        </Button>
      </div>

      {/* 인라인 답글 작성 폼 */}
      {showReplyForm && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2"
        >
          <WriteCommentForm
            planetId={planetId}
            parentId={comment.id}
            onSuccess={handleReplySuccess}
          />
        </div>
      )}

      {/* 대댓글 목록 — 인덴트 + 왼쪽 보더로 시각적 계층 표현 */}
      {comment.replies.length > 0 && (
        <div className="mt-2.5 pl-4 border-l-2 border-[#2a3a5a]">
          {comment.replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              isFocused={false}
              onFocus={onFocus}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

interface ReplyItemProps {
  reply: CommentResponse;
  isFocused: boolean;
  onFocus: (commentId: string) => void;
}

/** 대댓글 카드 */
function ReplyItem({ reply, isFocused, onFocus }: ReplyItemProps) {
  return (
    <div
      data-comment-id={reply.id}
      onClick={(e) => {
        e.stopPropagation();
        onFocus(reply.id);
      }}
      className={`rounded-md p-2.5 mb-1.5 cursor-pointer transition-colors duration-200 border-l-2 ${
        isFocused
          ? 'bg-[#12203a] border-l-primary'
          : 'bg-[#0d0d1a] border-l-transparent'
      }`}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[#80cbc4] text-xs font-bold">
          ↳ {reply.authorNickname}
        </span>
        <span className="text-muted-foreground/60 text-[11px]">
          {new Date(reply.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>
      <p className="text-foreground/75 text-xs leading-relaxed m-0 whitespace-pre-wrap break-words">
        {reply.content}
      </p>
    </div>
  );
}

/** 행성의 댓글 목록 */
export function CommentList({ planetId }: CommentListProps) {
  const { data, isLoading, isError } = useComments(planetId);
  const focusedCommentId = useCommentFocusStore((s) => s.focusedCommentId);
  const setFocusedComment = useCommentFocusStore((s) => s.setFocusedComment);

  // 포커스된 댓글 ID가 바뀌면 해당 요소로 스크롤
  const prevFocusedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!focusedCommentId || focusedCommentId === prevFocusedRef.current) return;
    prevFocusedRef.current = focusedCommentId;

    const el = document.querySelector(`[data-comment-id="${focusedCommentId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedCommentId]);

  // 로딩 상태
  if (isLoading) {
    return (
      <p className="text-muted-foreground text-[13px] text-center py-4">
        댓글 로딩 중...
      </p>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <p className="text-destructive text-[13px] text-center py-4">
        댓글을 불러올 수 없습니다.
      </p>
    );
  }

  const comments = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div data-testid="comment-list">
      {/* 댓글 수 헤더 */}
      <p className="text-muted-foreground text-[13px] font-bold mb-3">
        댓글 {totalCount}개
      </p>

      {/* 댓글 없음 상태 */}
      {comments.length === 0 && (
        <p className="text-muted-foreground/50 text-[13px] text-center py-4">
          아직 댓글이 없습니다.
        </p>
      )}

      {/* 최상위 댓글 목록 */}
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          planetId={planetId}
          isFocused={focusedCommentId === comment.id}
          onFocus={setFocusedComment}
        />
      ))}
    </div>
  );
}
