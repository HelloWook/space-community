# UI Contracts: 스토리북 + 디자인 토큰 + WASD + 접근성

**Feature**: 008-storybook-setup
**Date**: 2026-03-26

## 1. useWASDControls 훅

### Interface

```typescript
interface UseWASDControlsOptions {
  /** 이동 속도 (기본: 0.3) */
  speed?: number;
  /** 활성화 여부 (기본: true) */
  enabled?: boolean;
  /** 이동 범위 제한 */
  bounds?: {
    min: [number, number, number];
    max: [number, number, number];
  };
}

function useWASDControls(options?: UseWASDControlsOptions): void;
```

### 동작 규약

- R3F `useFrame` 내에서 매 프레임 실행
- W: 카메라 forward 방향으로 전진
- A: 카메라 right 방향의 반대로 이동
- S: 카메라 forward 방향의 반대로 후진
- D: 카메라 right 방향으로 이동
- 카메라의 현재 회전(OrbitControls에 의해 결정)을 기준으로 방향 계산
- `document.activeElement`가 input/textarea/select이면 비활성화
- bounds 범위 밖으로 이동 불가 (clamp 처리)

## 2. ControlsHUD 컴포넌트

### Props Contract

```typescript
interface ControlsHUDProps {
  /** 표시 여부 제어 (외부) */
  visible?: boolean;
}
```

### 동작 규약

- 화면 하단 중앙에 반투명 배경으로 표시
- 텍스트: "WASD: 이동 | 마우스 드래그: 회전 | 스크롤: 줌 | 클릭: 선택"
- 첫 인터랙션(keydown 또는 mousedown) 감지 후 3초 후 1초간 페이드아웃
- 세션 스토리지에 표시 완료 상태 저장 → 재방문 시 미표시
- 포커스 가능하지 않음 (탭 순서에서 제외)

## 3. 접근성 요구사항

### 색상 대비 규약

| 텍스트 유형 | 최소 대비율 |
|------------|-----------|
| 일반 텍스트 (< 18px bold / < 24px regular) | 4.5:1 |
| 큰 텍스트 (≥ 18px bold / ≥ 24px regular) | 3:1 |
| UI 컴포넌트 경계선 | 3:1 |

### 키보드 접근성 규약

- 모든 인터랙티브 요소: Tab으로 도달 가능
- 포커스 링: `outline` 또는 `ring` 클래스로 명확히 표시
- 오버레이: 포커스 트랩 (Tab이 오버레이 밖으로 나가지 않음)

### 터치/클릭 영역 규약

- 모든 버튼: 최소 44x44px
- 링크: 충분한 패딩으로 44px 확보
