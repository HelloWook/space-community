'use client';

// 독립형 WebGL 미지원 폴백 컴포넌트
// Canvas3D와 별개로 단독 사용 가능

// WebGL을 지원하지 않는 브라우저에서 표시되는 전체 화면 안내 메시지
export function WebGLFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050510',
        color: '#ccc',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        padding: 24,
      }}
    >
      {/* 주요 안내 메시지 */}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 600,
          marginBottom: 12,
          color: '#fff',
        }}
      >
        이 브라우저는 3D 콘텐츠를 지원하지 않습니다
      </h1>

      {/* 최신 브라우저 사용 권장 안내 */}
      <p
        style={{
          fontSize: 15,
          color: '#999',
          maxWidth: 420,
          lineHeight: 1.6,
        }}
      >
        Galaxy Board는 WebGL 기반 3D 콘텐츠를 사용합니다.
        <br />
        Chrome, Firefox, Safari, Edge 등 최신 브라우저를 사용해 주세요.
      </p>
    </div>
  );
}
