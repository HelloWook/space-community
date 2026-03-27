import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

describe('Nebula 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', async () => {
    const mod = await import('../Nebula');
    expect(mod.Nebula).toBeDefined();
  });

  it('필수 props로 렌더링되어야 한다', async () => {
    const { Nebula } = await import('../Nebula');
    const { container } = render(
      <Nebula position={[0, 0, 0]} />
    );
    expect(container).toBeTruthy();
  });

  it('선택적 props로 렌더링되어야 한다', async () => {
    const { Nebula } = await import('../Nebula');
    const { container } = render(
      <Nebula position={[-10, 5, 3]} color="#cc6688" size={12} count={100} opacity={0.2} />
    );
    expect(container).toBeTruthy();
  });
});
