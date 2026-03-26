import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

describe('Asteroid 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', async () => {
    const mod = await import('../Asteroid');
    expect(mod.Asteroid).toBeDefined();
  });

  it('필수 props로 렌더링되어야 한다', async () => {
    const { Asteroid } = await import('../Asteroid');
    const { container } = render(
      <Asteroid center={[5, 3, -2]} orbitRadius={8} />
    );
    expect(container).toBeTruthy();
  });

  it('scale과 orbitSpeed props를 받아야 한다', async () => {
    const { Asteroid } = await import('../Asteroid');
    const { container } = render(
      <Asteroid center={[5, 3, -2]} orbitRadius={8} scale={0.8} orbitSpeed={0.02} />
    );
    expect(container).toBeTruthy();
  });
});
