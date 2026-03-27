// lucide-react ESM 모킹 — Jest에서 ESM import 문제 방지
import { forwardRef } from 'react';
import type { SVGProps } from 'react';

/** 모든 아이콘을 빈 SVG로 대체하는 스텁 컴포넌트 */
const createIcon = (name: string) =>
  forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => {
    const { createElement } = require('react');
    return createElement('svg', { ...props, ref, 'data-testid': `icon-${name}` });
  });

export const XIcon = createIcon('x');
export const X = createIcon('x');
export const ChevronDown = createIcon('chevron-down');
export const ChevronUp = createIcon('chevron-up');
export const Check = createIcon('check');
export const Circle = createIcon('circle');
