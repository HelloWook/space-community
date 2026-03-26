import { z } from 'zod';

// 댓글 작성 폼 유효성 검증 스키마
export const createCommentSchema = z.object({
  /** 댓글 내용 (1~500자) */
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(500, '내용은 500자 이내로 입력해주세요'),
  /** 작성자 닉네임 (1~20자) */
  authorNickname: z
    .string()
    .min(1, '닉네임을 입력해주세요')
    .max(20, '닉네임은 20자 이내로 입력해주세요'),
});

/** 댓글 작성 폼 데이터 타입 */
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
