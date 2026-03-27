import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

jest.mock('@react-three/drei', () => ({
  Trail: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="trail" {...props}>{children}</div>
  ),
}));

jest.mock('three', () => ({
  ...jest.requireActual('three'),
  Vector3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z, clone: jest.fn().mockReturnThis(), normalize: jest.fn().mockReturnThis(), multiplyScalar: jest.fn().mockReturnThis(), add: jest.fn().mockReturnThis(), set: jest.fn() })),
}));

describe('Meteor 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', async () => {
    const mod = await import('../Meteor');
    expect(mod.Meteor).toBeDefined();
  });

  it('필수 props로 렌더링되어야 한다', async () => {
    const { Meteor } = await import('../Meteor');
    const { container } = render(
      <Meteor startPosition={[10, 5, -3]} direction={[-1, -0.5, 0]} />
    );
    expect(container).toBeTruthy();
  });

  it('speed와 trailLength props를 받아야 한다', async () => {
    const { Meteor } = await import('../Meteor');
    const { container } = render(
      <Meteor startPosition={[10, 5, -3]} direction={[-1, -0.5, 0]} speed={0.8} trailLength={15} />
    );
    expect(container).toBeTruthy();
  });
});
