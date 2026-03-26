import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
  extend: jest.fn(),
}));

describe('BlackHole 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', async () => {
    const mod = await import('../BlackHole');
    expect(mod.BlackHole).toBeDefined();
  });

  it('필수 props로 렌더링되어야 한다', async () => {
    const { BlackHole } = await import('../BlackHole');
    const { container } = render(
      <BlackHole position={[20, -10, -15]} />
    );
    expect(container).toBeTruthy();
  });

  it('scale과 distortionStrength props를 받아야 한다', async () => {
    const { BlackHole } = await import('../BlackHole');
    const { container } = render(
      <BlackHole position={[20, -10, -15]} scale={5} distortionStrength={0.8} />
    );
    expect(container).toBeTruthy();
  });
});
