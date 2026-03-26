'use client';

// 독립형 WebGL 미지원 폴백 컴포넌트
// Canvas3D와 별개로 단독 사용 가능

// WebGL을 지원하지 않는 브라우저에서 표시되는 전체 화면 안내 메시지
export function WebGLFallback() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#050510] text-muted-foreground text-center p-6">
      {/* 주요 안내 메시지 */}
      <h1 className="text-[22px] font-semibold mb-3 text-foreground">
        이 브라우저는 3D 콘텐츠를 지원하지 않습니다
      </h1>

      {/* 최신 브라우저 사용 권장 안내 */}
      <p className="text-[15px] text-muted-foreground max-w-[420px] leading-relaxed">
        Galaxy Board는 WebGL 기반 3D 콘텐츠를 사용합니다.
        <br />
        Chrome, Firefox, Safari, Edge 등 최신 브라우저를 사용해 주세요.
      </p>
    </div>
  );
}
