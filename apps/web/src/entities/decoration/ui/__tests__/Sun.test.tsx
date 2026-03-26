import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

describe('Sun 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', async () => {
    const mod = await import('../Sun');
    expect(mod.Sun).toBeDefined();
  });

  it('필수 props로 렌더링되어야 한다', async () => {
    const { Sun } = await import('../Sun');
    const { container } = render(
      <Sun position={[-20, 15, -10]} />
    );
    expect(container).toBeTruthy();
  });

  it('scale, lightIntensity, color props를 받아야 한다', async () => {
    const { Sun } = await import('../Sun');
    const { container } = render(
      <Sun position={[-20, 15, -10]} scale={3} lightIntensity={2} color="#ffcc00" />
    );
    expect(container).toBeTruthy();
  });
});
