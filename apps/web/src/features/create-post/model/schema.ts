import { z } from 'zod';

// 게시글 작성 폼 유효성 검증 스키마
export const createPostSchema = z.object({
  /** 게시글 제목 (1~100자) */
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  /** 게시글 내용 (1~10000자) */
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(10000, '내용은 10000자 이내로 입력해주세요'),
  /** 작성자 닉네임 (1~20자) */
  authorNickname: z
    .string()
    .min(1, '닉네임을 입력해주세요')
    .max(20, '닉네임은 20자 이내로 입력해주세요'),
});

/** 게시글 작성 폼 데이터 타입 */
export type CreatePostFormData = z.infer<typeof createPostSchema>;
