'use client';

import type { PlanetAppearanceFormData } from '../model/schema';
import { ColorPicker } from './ColorPicker';
import { PLANET_SIZES, PLANET_SHAPES, SURFACE_PATTERNS } from '@galaxy-board/types';
import type { PlanetSize, PlanetShape, SurfacePattern } from '@galaxy-board/types';

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

  const sectionStyle = { marginBottom: '12px' };
  const labelStyle = { display: 'block' as const, color: '#ccc', marginBottom: '4px', fontSize: '12px' };
  const buttonGroupStyle = { display: 'flex' as const, flexWrap: 'wrap' as const, gap: '4px' };

  const optionButton = (selected: boolean) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    border: selected ? '2px solid #4a90d9' : '1px solid #444',
    backgroundColor: selected ? '#2a4a6e' : '#1a1a2e',
    color: '#fff',
    cursor: 'pointer' as const,
    fontSize: '11px',
  });

  return (
    <div data-testid="customize-panel" style={{ padding: '8px 0' }}>
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
      <div style={sectionStyle}>
        <label style={labelStyle}>형태</label>
        <div style={buttonGroupStyle}>
          {PLANET_SHAPES.map((shape) => (
            <button
              key={shape}
              type="button"
              onClick={() => updateField('shape', shape)}
              style={optionButton(appearance.shape === shape)}
              data-testid={`shape-${shape}`}
            >
              {SHAPE_LABELS[shape]}
            </button>
          ))}
        </div>
      </div>

      {/* 크기 */}
      <div style={sectionStyle}>
        <label style={labelStyle}>크기</label>
        <div style={buttonGroupStyle}>
          {PLANET_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => updateField('size', size)}
              style={optionButton(appearance.size === size)}
              data-testid={`size-${size}`}
            >
              {SIZE_LABELS[size]}
            </button>
          ))}
        </div>
      </div>

      {/* 패턴 */}
      <div style={sectionStyle}>
        <label style={labelStyle}>표면 패턴</label>
        <div style={buttonGroupStyle}>
          {SURFACE_PATTERNS.map((pattern) => (
            <button
              key={pattern}
              type="button"
              onClick={() => updateField('pattern', pattern)}
              style={optionButton(appearance.pattern === pattern)}
              data-testid={`pattern-${pattern}`}
            >
              {PATTERN_LABELS[pattern]}
            </button>
          ))}
        </div>
      </div>

      {/* 고리 */}
      <div style={sectionStyle}>
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={appearance.hasRing}
            onChange={(e) => updateField('hasRing', e.target.checked)}
            data-testid="hasRing-toggle"
          />
          고리 표시
        </label>
      </div>
    </div>
  );
}
