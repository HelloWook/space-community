import { z } from 'zod';
import { PLANET_SIZES, PLANET_SHAPES, SURFACE_PATTERNS, DEFAULT_APPEARANCE } from '@galaxy-board/types';

// HEX 색상 정규식
const hexColorRegex = /^#[0-9a-fA-F]{6}$/;

// 행성 외형 유효성 검증 스키마
export const planetAppearanceSchema = z.object({
  mainColor: z.string().regex(hexColorRegex, '유효한 HEX 색상을 입력해주세요'),
  subColor: z.string().regex(hexColorRegex, '유효한 HEX 색상을 입력해주세요'),
  size: z.enum(PLANET_SIZES as unknown as [string, ...string[]]),
  shape: z.enum(PLANET_SHAPES as unknown as [string, ...string[]]),
  pattern: z.enum(SURFACE_PATTERNS as unknown as [string, ...string[]]),
  hasRing: z.boolean(),
});

/** 행성 외형 폼 데이터 타입 */
export type PlanetAppearanceFormData = z.infer<typeof planetAppearanceSchema>;

/** 기본 외형 값 */
export const defaultAppearance: PlanetAppearanceFormData = {
  ...DEFAULT_APPEARANCE,
};
