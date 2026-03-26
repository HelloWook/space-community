'use client';

// 댓글/답글 작성 폼 컴포넌트
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateComment } from '@/entities/comment';
import { createCommentSchema, type CreateCommentFormData } from '../model/schema';

interface WriteCommentFormProps {
  /** 대상 Planet ID */
  planetId: string;
  /** 답글 대상 댓글 ID (없으면 최상위 댓글) */
  parentId?: string;
  /** 작성 성공 콜백 */
  onSuccess?: () => void;
}

/** 댓글/답글 작성 폼 */
export function WriteCommentForm({ planetId, parentId, onSuccess }: WriteCommentFormProps) {
  const { mutate, isPending } = useCreateComment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  // 폼 제출 핸들러
  const onSubmit = (formData: CreateCommentFormData) => {
    mutate(
      {
        planetId,
        data: {
          content: formData.content,
          authorNickname: formData.authorNickname,
          ...(parentId ? { parentId } : {}),
        },
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      },
    );
  };

  const isReply = !!parentId;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="write-comment-form"
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '8px',
      }}
    >
      <h3
        style={{
          color: '#ccc',
          fontSize: '13px',
          fontWeight: 'bold',
          marginBottom: '12px',
          margin: '0 0 12px 0',
        }}
      >
        {isReply ? '답글 작성' : '댓글 작성'}
      </h3>

      {/* 닉네임 입력 */}
      <div style={{ marginBottom: '10px' }}>
        <input
          {...register('authorNickname')}
          type="text"
          placeholder="닉네임"
          aria-label="닉네임"
          maxLength={20}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '4px',
            border: errors.authorNickname ? '1px solid #ff6b6b' : '1px solid #555',
            backgroundColor: '#0d0d1a',
            color: '#fff',
            fontSize: '13px',
            boxSizing: 'border-box',
          }}
        />
        {errors.authorNickname && (
          <p style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '4px', margin: '4px 0 0 0' }}>
            {errors.authorNickname.message}
          </p>
        )}
      </div>

      {/* 내용 입력 */}
      <div style={{ marginBottom: '10px' }}>
        <textarea
          {...register('content')}
          placeholder="내용을 입력해주세요 (최대 500자)"
          aria-label="댓글 내용"
          rows={3}
          maxLength={500}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '4px',
            border: errors.content ? '1px solid #ff6b6b' : '1px solid #555',
            backgroundColor: '#0d0d1a',
            color: '#fff',
            fontSize: '13px',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
        {errors.content && (
          <p style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '4px', margin: '4px 0 0 0' }}>
            {errors.content.message}
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: isPending ? '#555' : '#4a90d9',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 'bold',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? '전송 중...' : isReply ? '답글 작성' : '댓글 작성'}
      </button>
    </form>
  );
}
