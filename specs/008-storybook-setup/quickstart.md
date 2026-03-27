# Quickstart: 스토리북 + 디자인 토큰 + WASD + 접근성

**Feature**: 008-storybook-setup
**Date**: 2026-03-26

## 사전 요구사항

- Node.js 22+
- Yarn 1.22+
- 007-frontend-redesign 머지 완료 (shadcn/ui, Tailwind CSS v4 세팅)

## 스토리북 실행

```bash
# 스토리북 서버 시작
yarn workspace @galaxy-board/web storybook

# 브라우저에서 접속
# http://localhost:6006
```

## 개발 서버 실행

```bash
yarn dev
# http://localhost:3000 에서 WASD 탐험 확인
```

## 이 피처의 핵심 파일

### 신규 생성 파일

| 파일 | 설명 |
|------|------|
| `apps/web/.storybook/main.ts` | 스토리북 메인 설정 |
| `apps/web/.storybook/preview.ts` | 글로벌 데코레이터 (Tailwind 테마) |
| `apps/web/src/stories/design-tokens/Colors.stories.tsx` | 색상 토큰 문서 |
| `apps/web/src/stories/design-tokens/Typography.stories.tsx` | 타이포그래피 토큰 문서 |
| `apps/web/src/stories/design-tokens/Spacing.stories.tsx` | 간격 토큰 문서 |
| `apps/web/src/stories/ui/*.stories.tsx` | UI 컴포넌트 스토리들 |
| `apps/web/src/stories/3d/*.stories.tsx` | 3D 컴포넌트 스토리들 |
| `apps/web/src/shared/lib/hooks/use-wasd-controls.ts` | WASD 카메라 컨트롤 훅 |
| `apps/web/src/features/navigate-galaxy/ui/ControlsHUD.tsx` | 조작 안내 UI |

### 주요 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `apps/web/src/app/styles/globals.css` | 타이포그래피 토큰 추가, 폰트 크기 기본값 조정 |
| `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx` | WASD 훅 통합, ControlsHUD 추가 |
| 인라인 `text-[11px]`~`text-[13px]` 사용 파일들 | 최소 `text-sm`(14px) 이상으로 상향 |

## 테스트

```bash
# 프론트엔드 테스트
yarn workspace @galaxy-board/web test

# 스토리북 빌드 검증
yarn workspace @galaxy-board/web build-storybook
```

## 접근성 검증

```bash
# Lighthouse 접근성 감사 (브라우저 DevTools에서 실행)
# 또는 axe DevTools 확장 프로그램 사용
```
