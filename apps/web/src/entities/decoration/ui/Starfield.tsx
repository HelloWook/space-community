'use client';

import { Stars } from '@react-three/drei';

interface StarfieldProps {
  /** 별 개수 (기본: 1000) */
  count?: number;
  /** 분포 반경 (기본: 100) */
  radius?: number;
}

export function Starfield({ count = 1000, radius = 100 }: StarfieldProps) {
  return (
    <Stars
      radius={radius}
      depth={50}
      count={count}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  );
}
