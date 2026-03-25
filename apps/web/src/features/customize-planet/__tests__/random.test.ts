import { generateRandomAppearance } from '../model/random';
import { PLANET_SIZES, PLANET_SHAPES, SURFACE_PATTERNS } from '@galaxy-board/types';

describe('generateRandomAppearance', () => {
  it('유효한 행성 외형을 생성해야 한다', () => {
    const appearance = generateRandomAppearance();

    // HEX 색상 형식 검증
    expect(appearance.mainColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(appearance.subColor).toMatch(/^#[0-9a-fA-F]{6}$/);

    // enum 값 검증
    expect(PLANET_SIZES).toContain(appearance.size);
    expect(PLANET_SHAPES).toContain(appearance.shape);
    expect(SURFACE_PATTERNS).toContain(appearance.pattern);

    // boolean 검증
    expect(typeof appearance.hasRing).toBe('boolean');
  });

  it('연속 호출 시 다른 결과를 생성해야 한다', () => {
    const results = Array.from({ length: 10 }, () => generateRandomAppearance());

    // 10번 생성 중 최소 2가지 다른 mainColor가 있어야 함
    const uniqueColors = new Set(results.map((r) => r.mainColor));
    expect(uniqueColors.size).toBeGreaterThan(1);

    // 최소 2가지 다른 shape가 있어야 함
    const uniqueShapes = new Set(results.map((r) => r.shape));
    expect(uniqueShapes.size).toBeGreaterThan(1);
  });
});
