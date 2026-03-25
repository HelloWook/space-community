import { PLANET_SIZES, PLANET_SHAPES, SURFACE_PATTERNS } from '@galaxy-board/types';
import type { PlanetAppearanceFormData } from './schema';

// 랜덤 HEX 색상 생성
function randomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  return `#${hex}`;
}

// 배열에서 랜덤 요소 선택
function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 랜덤 행성 외형 생성 */
export function generateRandomAppearance(): PlanetAppearanceFormData {
  return {
    mainColor: randomHexColor(),
    subColor: randomHexColor(),
    size: randomPick(PLANET_SIZES),
    shape: randomPick(PLANET_SHAPES),
    pattern: randomPick(SURFACE_PATTERNS),
    hasRing: Math.random() > 0.5,
  };
}
