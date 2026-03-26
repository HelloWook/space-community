'use client';

import type { PlanetAppearanceFormData } from '../model/schema';
import { generateRandomAppearance } from '../model/random';
import { ColorPicker } from './ColorPicker';
import { PLANET_SIZES, PLANET_SHAPES, SURFACE_PATTERNS } from '@galaxy-board/types';
import type { PlanetSize, PlanetShape, SurfacePattern } from '@galaxy-board/types';
import { Button } from '@/shared/ui/shadcn/button';

// 형태 한글 라벨
const SHAPE_LABELS: Record<PlanetShape, string> = {
  SPHERE: '구',
  BOX: '정육면체',
  TETRAHEDRON: '사면체',
  OCTAHEDRON: '팔면체',
  DODECAHEDRON: '십이면체',
  TORUS: '도넛',
  CYLINDER: '원기둥',
  CONE: '원뿔',
};

// 크기 한글 라벨
const SIZE_LABELS: Record<PlanetSize, string> = {
  SMALL: '소',
  MEDIUM: '중',
  LARGE: '대',
};

// 패턴 한글 라벨
const PATTERN_LABELS: Record<SurfacePattern, string> = {
  SMOOTH: '매끈',
  CRATER: '크레이터',
  STRIPE: '줄무늬',
  CLOUD: '구름',
};

interface CustomizePanelProps {
  /** 현재 외형 상태 */
  appearance: PlanetAppearanceFormData;
  /** 외형 변경 콜백 */
  onChange: (appearance: PlanetAppearanceFormData) => void;
}

// 행성 커스터마이징 패널 — 색상, 형태, 크기, 패턴, 고리 설정
export function CustomizePanel({ appearance, onChange }: CustomizePanelProps) {
  // 개별 필드 변경 헬퍼
  const updateField = <K extends keyof PlanetAppearanceFormData>(
    key: K,
    value: PlanetAppearanceFormData[K],
  ) => {
    onChange({ ...appearance, [key]: value });
  };

  return (
    <div data-testid="customize-panel" className="py-2">
      {/* 랜덤 버튼 */}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange(generateRandomAppearance())}
        data-testid="random-button"
        className="w-full mb-3"
      >
        🎲 랜덤 생성
      </Button>

      {/* 색상 */}
      <ColorPicker
        label="메인 색상"
        value={appearance.mainColor}
        onChange={(color) => updateField('mainColor', color)}
      />
      <ColorPicker
        label="보조 색상"
        value={appearance.subColor}
        onChange={(color) => updateField('subColor', color)}
      />

      {/* 형태 */}
      <div className="mb-3">
        <label className="block text-muted-foreground mb-1 text-xs">형태</label>
        <div className="flex flex-wrap gap-1">
          {PLANET_SHAPES.map((shape) => (
            <Button
              key={shape}
              type="button"
              variant={appearance.shape === shape ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateField('shape', shape)}
              data-testid={`shape-${shape}`}
              className="h-7 px-2 text-[11px]"
            >
              {SHAPE_LABELS[shape]}
            </Button>
          ))}
        </div>
      </div>

      {/* 크기 */}
      <div className="mb-3">
        <label className="block text-muted-foreground mb-1 text-xs">크기</label>
        <div className="flex flex-wrap gap-1">
          {PLANET_SIZES.map((size) => (
            <Button
              key={size}
              type="button"
              variant={appearance.size === size ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateField('size', size)}
              data-testid={`size-${size}`}
              className="h-7 px-2 text-[11px]"
            >
              {SIZE_LABELS[size]}
            </Button>
          ))}
        </div>
      </div>

      {/* 패턴 */}
      <div className="mb-3">
        <label className="block text-muted-foreground mb-1 text-xs">표면 패턴</label>
        <div className="flex flex-wrap gap-1">
          {SURFACE_PATTERNS.map((pattern) => (
            <Button
              key={pattern}
              type="button"
              variant={appearance.pattern === pattern ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateField('pattern', pattern)}
              data-testid={`pattern-${pattern}`}
              className="h-7 px-2 text-[11px]"
            >
              {PATTERN_LABELS[pattern]}
            </Button>
          ))}
        </div>
      </div>

      {/* 고리 */}
      <div className="mb-3">
        <label className="flex items-center gap-2 text-muted-foreground text-xs">
          <input
            type="checkbox"
            checked={appearance.hasRing}
            onChange={(e) => updateField('hasRing', e.target.checked)}
            data-testid="hasRing-toggle"
            className="rounded border-border"
          />
          고리 표시
        </label>
      </div>
    </div>
  );
}
