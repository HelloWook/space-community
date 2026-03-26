'use client';

// 댓글 목록 컴포넌트 — 행성(게시글)의 모든 최상위 댓글 표시
import { useComments } from '../api/hooks';
import { useCommentFocusStore } from '../model/comment-focus-store';
import { useEffect, useRef, useState } from 'react';
import type { CommentResponse } from '@galaxy-board/types';
import { WriteCommentForm } from '@/features/write-comment';

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
    <div
      data-comment-id={comment.id}
      onClick={() => onFocus(comment.id)}
      style={{
        backgroundColor: isFocused ? '#1e2a45' : '#1a1a2e',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        borderLeft: isFocused ? '3px solid #4a90d9' : '3px solid transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s, border-left-color 0.2s',
      }}
    >
      {/* 댓글 헤더: 닉네임 + 날짜 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span style={{ color: '#90caf9', fontSize: '13px', fontWeight: 'bold' }}>
          {comment.authorNickname}
        </span>
        <span style={{ color: '#666', fontSize: '11px' }}>
          {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>

      {/* 댓글 내용 */}
      <p
        style={{
          color: '#ddd',
          fontSize: '13px',
          lineHeight: '1.6',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {comment.content}
      </p>

      {/* 답글 버튼 (최상위 댓글만) */}
      <div style={{ marginTop: '8px' }}>
        <button
          onClick={(e) => {
            // 클릭 이벤트가 상위 div 포커스 핸들러까지 전파되지 않도록 방지
            e.stopPropagation();
            setShowReplyForm((prev) => !prev);
          }}
          aria-label={showReplyForm ? '답글 폼 닫기' : '답글 작성'}
          style={{
            background: 'none',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#aaa',
            fontSize: '11px',
            padding: '3px 8px',
            cursor: 'pointer',
          }}
        >
          {showReplyForm ? '취소' : '답글'}
        </button>
      </div>

      {/* 인라인 답글 작성 폼 */}
      {showReplyForm && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ marginTop: '8px' }}
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
        <div style={{ marginTop: '10px', paddingLeft: '16px', borderLeft: '2px solid #2a3a5a' }}>
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
    </div>
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
      style={{
        backgroundColor: isFocused ? '#12203a' : '#0d0d1a',
        borderRadius: '6px',
        padding: '10px',
        marginBottom: '6px',
        borderLeft: isFocused ? '2px solid #4a90d9' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s, border-left-color 0.2s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
        }}
      >
        <span style={{ color: '#80cbc4', fontSize: '12px', fontWeight: 'bold' }}>
          ↳ {reply.authorNickname}
        </span>
        <span style={{ color: '#555', fontSize: '11px' }}>
          {new Date(reply.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>
      <p
        style={{
          color: '#bbb',
          fontSize: '12px',
          lineHeight: '1.6',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
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
      <p style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
        댓글 로딩 중...
      </p>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <p style={{ color: '#ff6b6b', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
        댓글을 불러올 수 없습니다.
      </p>
    );
  }

  const comments = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div data-testid="comment-list">
      {/* 댓글 수 헤더 */}
      <p
        style={{
          color: '#ccc',
          fontSize: '13px',
          fontWeight: 'bold',
          marginBottom: '12px',
          margin: '0 0 12px 0',
        }}
      >
        댓글 {totalCount}개
      </p>

      {/* 댓글 없음 상태 */}
      {comments.length === 0 && (
        <p style={{ color: '#666', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
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
