# UI Contracts: 프론트엔드 전체 리디자인

**Feature**: 007-frontend-redesign
**Date**: 2026-03-26

## 1. 공통 오버레이 컴포넌트 (Overlay)

### Props Contract

```typescript
interface OverlayProps {
  /** 오버레이 열림 상태 */
  open: boolean;
  /** 닫기 콜백 (ESC, 배경 클릭 시 호출) */
  onClose: () => void;
  /** 오버레이 제목 (선택) */
  title?: string;
  /** 오버레이 내부 콘텐츠 */
  children: React.ReactNode;
  /** 너비 커스터마이징 (기본: 400px) */
  className?: string;
}
```

### 동작 규약

- `open=true` → 페이드인 애니메이션 (200ms)으로 표시
- `open=false` → 페이드아웃 애니메이션 (200ms)으로 숨김
- 배경: 연보라 반투명 (`--overlay-bg`) + `backdrop-blur-md`
- 컨테이너: 글래스모피즘 (`--overlay-border`, `border`, `rounded-lg`)
- ESC 키 또는 배경 클릭 → `onClose()` 호출
- 오버레이 열림 시 3D 씬 포인터 이벤트 차단
- 포커스 트랩: 오버레이 내부에서만 Tab 이동

## 2. 장식 요소 컴포넌트

### Starfield Props

```typescript
interface StarfieldProps {
  /** 별 개수 (기본: 1000) */
  count?: number;
  /** 분포 반경 (기본: 100) */
  radius?: number;
}
```

### Meteor Props

```typescript
interface MeteorProps {
  /** 시작 위치 */
  startPosition: [number, number, number];
  /** 이동 방향 벡터 */
  direction: [number, number, number];
  /** 이동 속도 (기본: 0.5) */
  speed?: number;
  /** 꼬리 길이 (기본: 10) */
  trailLength?: number;
}
```

### Asteroid Props

```typescript
interface AsteroidProps {
  /** 궤도 중심 */
  center: [number, number, number];
  /** 궤도 반경 */
  orbitRadius: number;
  /** 크기 (기본: 0.5) */
  scale?: number;
  /** 궤도 속도 (기본: 0.01) */
  orbitSpeed?: number;
}
```

### BlackHole Props

```typescript
interface BlackHoleProps {
  /** 위치 */
  position: [number, number, number];
  /** 크기 (기본: 3) */
  scale?: number;
  /** 왜곡 강도 (기본: 0.5) */
  distortionStrength?: number;
}
```

### Sun Props

```typescript
interface SunProps {
  /** 위치 */
  position: [number, number, number];
  /** 크기 (기본: 2) */
  scale?: number;
  /** 조명 강도 (기본: 1.5) */
  lightIntensity?: number;
  /** 발광 색상 (기본: '#ffaa33') */
  color?: string;
}
```

## 3. 로그인 오버레이 컴포넌트

### LoginOverlay Props

```typescript
interface LoginOverlayProps {
  /** 열림 상태 */
  open: boolean;
  /** 닫기 콜백 */
  onClose: () => void;
  /** 로그인 성공 콜백 */
  onSuccess?: () => void;
}
```

### 동작 규약

- 공통 Overlay 컴포넌트 내부에 렌더링
- Google OAuth + GitHub OAuth 버튼 표시
- Clerk Custom Flow (`useSignIn`) 사용
- 로그인 성공 → `onSuccess()` 호출 후 자동 닫힘
- 로그인 실패 → 에러 메시지 표시 (오버레이 유지)

## 4. 기존 컴포넌트 마이그레이션 규약

### 인라인 스타일 → Tailwind 매핑 규칙

| 인라인 스타일 | Tailwind 클래스 |
|--------------|----------------|
| `position: 'fixed'` | `fixed` |
| `position: 'absolute'` | `absolute` |
| `top: 0, right: 0, bottom: 0` | `inset-y-0 right-0` |
| `width: '400px'` | `w-[400px]` |
| `backgroundColor: 'rgba(10, 10, 30, 0.92)'` | `bg-[rgba(10,10,30,0.92)]` 또는 테마 변수 사용 |
| `zIndex: 50` | `z-50` |
| `padding: '24px'` | `p-6` |
| `borderRadius: '8px'` | `rounded-lg` |
| `fontSize: '14px'` | `text-sm` |
| `color: '#ccc'` | `text-muted-foreground` |
| `border: '1px solid #333'` | `border border-border` |

### shadcn/ui 교체 매핑

| 기존 요소 | shadcn/ui 대체 |
|-----------|---------------|
| `<button>` | `<Button>` |
| `<input>` | `<Input>` |
| `<textarea>` | `<Textarea>` |
| `<select>` | `<Select>` |
| 커스텀 카드 div | `<Card>` |
| 커스텀 모달 div | `<Dialog>` (공통 Overlay 경유) |
