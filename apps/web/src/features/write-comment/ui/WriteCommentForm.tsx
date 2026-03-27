'use client';

// 댓글/답글 작성 폼 컴포넌트
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateComment } from '@/entities/comment';
import { createCommentSchema, type CreateCommentFormData } from '../model/schema';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';

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
      className="bg-card rounded-lg p-4 mt-2"
    >
      <h3 className="text-muted-foreground text-sm font-bold mb-3">
        {isReply ? '답글 작성' : '댓글 작성'}
      </h3>

      {/* 닉네임 입력 */}
      <div className="mb-2.5">
        <Input
          {...register('authorNickname')}
          type="text"
          placeholder="닉네임"
          aria-label="닉네임"
          maxLength={20}
          className={errors.authorNickname ? 'border-destructive' : ''}
        />
        {errors.authorNickname && (
          <p className="text-destructive text-xs mt-1">
            {errors.authorNickname.message}
          </p>
        )}
      </div>

      {/* 내용 입력 */}
      <div className="mb-2.5">
        <Textarea
          {...register('content')}
          placeholder="내용을 입력해주세요 (최대 500자)"
          aria-label="댓글 내용"
          rows={3}
          maxLength={500}
          className={errors.content ? 'border-destructive' : ''}
        />
        {errors.content && (
          <p className="text-destructive text-xs mt-1">
            {errors.content.message}
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <Button
        type="submit"
        size="sm"
        disabled={isPending}
      >
        {isPending ? '전송 중...' : isReply ? '답글 작성' : '댓글 작성'}
      </Button>
    </form>
  );
}
