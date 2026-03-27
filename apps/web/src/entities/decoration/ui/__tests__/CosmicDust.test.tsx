import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

describe('CosmicDust 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', async () => {
    const mod = await import('../CosmicDust');
    expect(mod.CosmicDust).toBeDefined();
  });

  it('기본 props로 렌더링되어야 한다', async () => {
    const { CosmicDust } = await import('../CosmicDust');
    const { container } = render(
      <CosmicDust />
    );
    expect(container).toBeTruthy();
  });

  it('선택적 props로 렌더링되어야 한다', async () => {
    const { CosmicDust } = await import('../CosmicDust');
    const { container } = render(
      <CosmicDust count={300} radius={80} opacity={0.2} />
    );
    expect(container).toBeTruthy();
  });
});
