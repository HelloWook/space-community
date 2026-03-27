# Data Model: 스토리북 + 디자인 토큰 + WASD + 접근성

**Feature**: 008-storybook-setup
**Date**: 2026-03-26

## 개요

이 피처는 프론트엔드 전용 기능으로 백엔드 데이터 모델 변경이 없다.

## 프론트엔드 엔티티

### Design Token (디자인 토큰)

CSS 변수로 정의되는 시각적 상수 체계. `globals.css`에서 관리.

**색상 토큰** (기존 + 확장):

| 토큰 | HSL 값 | 용도 |
|------|--------|------|
| --background | 0 0% 0% | 전체 배경 (우주 검정) |
| --foreground | 0 0% 100% | 기본 텍스트 (흰색) |
| --primary | 217 91% 60% | 주요 액션 |
| --accent | 270 50% 40% | 악센트 (연보라) |
| --muted | 240 4% 16% | 비활성 배경 |
| --muted-foreground | 240 5% 65% | 비활성 텍스트 |
| --card | 0 0% 5% | 카드 배경 |
| --destructive | 0 84% 60% | 위험/에러 |
| --border | 240 4% 16% | 테두리 |
| --overlay-bg | 270 50% 10% | 오버레이 배경 |
| --overlay-border | 270 50% 50% | 오버레이 테두리 |
| --glow-purple | 270 70% 60% | 보라 글로우 |

**타이포그래피 토큰**:

| 토큰 | 값 | 용도 |
|------|-----|------|
| --font-sans | system-ui, -apple-system, sans-serif | 기본 본문 |
| --font-mono | ui-monospace, monospace | 코드/프리포맷 |
| text-xs | 12px / 0.75rem | 아이콘 내 텍스트 (최소 사용) |
| text-sm | 14px / 0.875rem | 캡션, 메타 정보 |
| text-base | 16px / 1rem | 본문 기본 |
| text-lg | 18px / 1.125rem | 소제목 |
| text-xl | 20px / 1.25rem | 중제목 |
| text-2xl | 24px / 1.5rem | 제목 |
| text-3xl | 30px / 1.875rem | 대제목 |
| text-4xl | 36px / 2.25rem | 히어로 |

**간격 토큰**: Tailwind 기본 4px 단위 스케일 사용 (별도 커스텀 불필요)

**테두리 반경 토큰**:

| 토큰 | 값 |
|------|-----|
| --radius | 0.5rem (8px) |
| rounded-sm | 4px |
| rounded-md | 8px |
| rounded-lg | 12px |
| rounded-xl | 16px |

### WASD Controls State (WASD 컨트롤 상태)

`useWASDControls` 훅 내부 상태.

| 속성 | 타입 | 설명 |
|------|------|------|
| keys | `{ w: boolean, a: boolean, s: boolean, d: boolean }` | 현재 눌린 키 상태 |
| enabled | `boolean` | 활성화 여부 (오버레이/입력 시 false) |
| speed | `number` | 이동 속도 (기본: 0.3) |
| bounds | `{ min: Vector3, max: Vector3 }` | 이동 범위 제한 |

### Controls HUD State (조작 안내 상태)

| 속성 | 타입 | 설명 |
|------|------|------|
| visible | `boolean` | 표시 여부 |
| hasInteracted | `boolean` | 사용자가 첫 인터랙션을 했는지 |
| fadeOut | `boolean` | 페이드아웃 애니메이션 진행 중 |
