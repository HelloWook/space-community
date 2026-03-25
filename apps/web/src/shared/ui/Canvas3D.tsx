'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { type ReactNode, useEffect, useState } from 'react';

// WebGL 지원 여부 감지
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// WebGL 미지원 시 표시할 폴백 컴포넌트
export function Canvas3DFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#050510',
        color: '#888',
      }}
    >
      WebGL을 지원하지 않는 브라우저입니다.
    </div>
  );
}

interface Canvas3DProps {
  /** 3D 오브젝트 */
  children?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

// Canvas3D 래퍼 — R3F Canvas + OrbitControls + 기본 조명 + WebGL 감지
export function Canvas3D({ children, className }: Canvas3DProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(detectWebGL());
  }, []);

  if (!webglSupported) {
    return <Canvas3DFallback />;
  }

  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 50], fov: 60 }}
      gl={{ antialias: true }}
    >
      {/* 어두운 우주 배경색 */}
      <color attach="background" args={['#050510']} />
      {/* 기본 조명 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {/* 줌/회전 활성화, 감쇠 효과 적용 */}
      <OrbitControls
        enableDamping
        enableZoom
        enableRotate
      />
      {children}
    </Canvas>
  );
}
