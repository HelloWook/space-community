import { z } from 'zod';

// 은하계 생성 폼 유효성 검증 스키마
export const createGalaxySchema = z.object({
  /** 은하계 이름 (1~50자) */
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름은 50자 이내로 입력해주세요'),
  /** 은하계 설명 (1~200자) */
  description: z
    .string()
    .min(1, '설명을 입력해주세요')
    .max(200, '설명은 200자 이내로 입력해주세요'),
});

/** 은하계 생성 폼 데이터 타입 */
export type CreateGalaxyFormData = z.infer<typeof createGalaxySchema>;
