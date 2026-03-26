import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@react-three/drei', () => ({
  Stars: (props: Record<string, unknown>) => (
    <div data-testid="stars" {...props} />
  ),
}));

describe('Starfield 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', async () => {
    const mod = await import('../Starfield');
    expect(mod.Starfield).toBeDefined();
  });

  it('기본 props로 렌더링되어야 한다', async () => {
    const { Starfield } = await import('../Starfield');
    const { container } = render(<Starfield />);
    expect(container).toBeTruthy();
  });

  it('count와 radius props를 받아야 한다', async () => {
    const { Starfield } = await import('../Starfield');
    const { container } = render(<Starfield count={2000} radius={150} />);
    expect(container).toBeTruthy();
  });
});
