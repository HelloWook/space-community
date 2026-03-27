'use client';

import { useMemo } from 'react';

interface CosmicDustProps {
  /** 파티클 수 (기본: 500) */
  count?: number;
  /** 분산 반경 (기본: 150) */
  radius?: number;
  /** 투명도 (기본: 0.15) */
  opacity?: number;
}

export function CosmicDust({
  count = 500,
  radius = 150,
  opacity = 0.15,
}: CosmicDustProps) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // 구형 균일 분포
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * radius;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }

    return pos;
  }, [count, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        transparent
        opacity={opacity}
        color="#aaaacc"
        sizeAttenuation
      />
    </points>
  );
}
