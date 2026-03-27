import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

describe('DistantGalaxy 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', async () => {
    const mod = await import('../DistantGalaxy');
    expect(mod.DistantGalaxy).toBeDefined();
  });

  it('필수 props로 렌더링되어야 한다', async () => {
    const { DistantGalaxy } = await import('../DistantGalaxy');
    const { container } = render(
      <DistantGalaxy position={[50, 20, -30]} />
    );
    expect(container).toBeTruthy();
  });

  it('color와 scale props를 받아야 한다', async () => {
    const { DistantGalaxy } = await import('../DistantGalaxy');
    const { container } = render(
      <DistantGalaxy position={[50, 20, -30]} color="#ffbbaa" scale={0.8} />
    );
    expect(container).toBeTruthy();
  });
});
