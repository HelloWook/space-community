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
    <div className="mb-2">
      <label className="block text-muted-foreground mb-1 text-xs">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* 색상 미리보기 버튼 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          data-testid={`color-picker-${label}`}
          className="w-8 h-8 rounded border-2 border-border cursor-pointer"
          style={{ backgroundColor: value }}
        />
        {/* HEX 입력 */}
        <HexColorInput
          color={value}
          onChange={onChange}
          prefixed
          className="w-20 px-2 py-1 rounded border border-border bg-card text-foreground text-xs"
        />
      </div>
      {/* 피커 팝업 */}
      {isOpen && (
        <div className="absolute z-10 mt-1">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative">
            <HexColorPicker color={value} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  );
}
