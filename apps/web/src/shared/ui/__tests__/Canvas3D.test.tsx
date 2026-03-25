import React from 'react';
import { render, screen } from '@testing-library/react';

// R3F Canvas는 jsdom에서 WebGL 미지원으로 직접 렌더링 불가 — 모듈을 모킹하여 테스트
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="r3f-canvas" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: (props: Record<string, unknown>) => (
    <div data-testid="orbit-controls" {...props} />
  ),
}));

describe('Canvas3D 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', async () => {
    const mod = await import('@/shared/ui/Canvas3D');
    expect(mod.Canvas3D).toBeDefined();
    expect(mod.Canvas3DFallback).toBeDefined();
  });

  it('Canvas3DFallback이 폴백 메시지를 표시해야 한다', async () => {
    const { Canvas3DFallback } = await import('@/shared/ui/Canvas3D');
    render(<Canvas3DFallback />);
    expect(screen.getByText(/WebGL/i)).toBeInTheDocument();
  });

  it('jsdom 환경에서 Canvas3D는 WebGL 미지원으로 폴백을 표시해야 한다', async () => {
    const { Canvas3D } = await import('@/shared/ui/Canvas3D');
    render(<Canvas3D />);
    // jsdom에서는 WebGL 미지원 → useEffect 후 폴백 표시
    // 초기 렌더에서는 Canvas가 보이지만, effect 후 폴백으로 전환
    // 폴백 메시지가 최종적으로 표시되는지 확인
    expect(await screen.findByText(/WebGL/i)).toBeInTheDocument();
  });
});
