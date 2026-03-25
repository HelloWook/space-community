import React from 'react';

// R3F Canvas는 jsdom에서 WebGL 미지원으로 직접 렌더링 불가
// 컴포넌트 모듈이 정상적으로 import되는지 확인하는 스모크 테스트
describe('Scene 컴포넌트', () => {
  it('모듈이 정상적으로 import되어야 한다', () => {
    const { Scene } = require('@/shared/ui/Scene');
    expect(Scene).toBeDefined();
    expect(typeof Scene).toBe('function');
  });
});
