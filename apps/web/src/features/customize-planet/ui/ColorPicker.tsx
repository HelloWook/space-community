'use client';

import { useState } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';

interface ColorPickerProps {
  /** 라벨 텍스트 */
  label: string;
  /** 현재 색상값 (HEX) */
  value: string;
  /** 색상 변경 콜백 */
  onChange: (color: string) => void;
}

// HEX 컬러 피커 — Popover 스타일 색상 선택기
export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: '8px' }}>
      <label style={{ display: 'block', color: '#ccc', marginBottom: '4px', fontSize: '12px' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* 색상 미리보기 버튼 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          data-testid={`color-picker-${label}`}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            border: '2px solid #555',
            backgroundColor: value,
            cursor: 'pointer',
          }}
        />
        {/* HEX 입력 */}
        <HexColorInput
          color={value}
          onChange={onChange}
          prefixed
          style={{
            width: '80px',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #444',
            backgroundColor: '#1a1a2e',
            color: '#fff',
            fontSize: '12px',
          }}
        />
      </div>
      {/* 피커 팝업 */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            marginTop: '4px',
          }}
        >
          <div
            style={{
              position: 'fixed',
              inset: 0,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{ position: 'relative' }}>
            <HexColorPicker color={value} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  );
}
