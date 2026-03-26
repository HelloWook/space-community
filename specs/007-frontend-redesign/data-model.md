# Data Model: 프론트엔드 전체 리디자인

**Feature**: 007-frontend-redesign
**Date**: 2026-03-26

## 개요

이 피처는 프론트엔드 UI/UX 리디자인으로, 백엔드 데이터 모델(Prisma 스키마) 변경이 **없다**. 아래는 프론트엔드 상태 관리 및 UI 관련 엔티티를 문서화한다.

## 프론트엔드 엔티티

### Decoration (장식 요소)

순수 프론트엔드 3D 오브젝트. 백엔드 데이터와 무관.

| 속성 | 타입 | 설명 |
|------|------|------|
| type | `'starfield' \| 'meteor' \| 'asteroid' \| 'blackhole' \| 'sun'` | 장식 요소 유형 |
| position | `[x, y, z]` | 3D 공간 좌표 |
| scale | `number` | 크기 배율 |
| visible | `boolean` | 렌더링 여부 (성능 조절용) |

**제약사항**:
- 유성(meteor): 동시 최대 3개
- 운석(asteroid): 동시 최대 10개
- 블랙홀(blackhole): 최대 1개
- 태양(sun): 최대 1개
- 별 파티클(starfield): GPU 인스턴싱, 수량 제한 없음 (drei Stars 기반)

**상태 전이**: 없음 (정적 배치 + 프레임 기반 애니메이션)

### Overlay (오버레이 상태)

Zustand 스토어에서 관리하는 UI 상태.

| 속성 | 타입 | 설명 |
|------|------|------|
| isOpen | `boolean` | 열림/닫힘 상태 |
| type | `'login' \| 'createPost' \| 'createGalaxy' \| 'postDetail' \| null` | 현재 오버레이 유형 |
| data | `Record<string, unknown> \| null` | 오버레이에 전달할 데이터 (예: planetId) |

**상태 전이**:
```
Closed → Opening (애니메이션) → Open → Closing (애니메이션) → Closed
```

**제약사항**:
- 동시에 하나의 오버레이만 열림
- 3D 씬 인터랙션은 오버레이 열림 시 차단

### Theme (테마 토큰)

CSS 변수로 정의. `globals.css`에서 관리.

| 토큰 | 현재 값 | 용도 |
|------|---------|------|
| --background | `0 0% 0%` | 전체 배경 (우주 검정) |
| --foreground | `0 0% 100%` | 기본 텍스트 (흰색) |
| --primary | `217 91% 60%` | 주요 액션 색상 (파란색) |
| --accent | `270 50% 40%` → 변경 예정 | 악센트 (연보라로 변경) |
| --card | `0 0% 5%` | 카드 배경 |
| --muted | `240 4% 16%` | 비활성 요소 |
| --destructive | `0 84% 60%` | 위험 액션 (빨간색) |
| --border | `240 4% 16%` | 테두리 |
| --ring | `217 91% 60%` | 포커스 링 |
| --radius | `0.5rem` | 기본 border-radius |

**추가 예정 토큰**:
| 토큰 | 값 | 용도 |
|------|-----|------|
| --overlay-bg | `270 50% 10% / 0.85` | 오버레이 배경 (연보라 반투명) |
| --overlay-border | `270 50% 50% / 0.2` | 오버레이 테두리 |
| --glow-purple | `270 70% 60%` | 보라 글로우 효과 |

## 기존 백엔드 엔티티 (변경 없음)

참고용으로 현재 Prisma 스키마의 주요 엔티티를 기록:

- **User**: clerkId, email, name, imageUrl, providers[]
- **Galaxy**: name, description, position(X/Y/Z)
- **Planet**: title, content, authorNickname, starCount, commentCount, position(X/Y/Z), customization(mainColor, subColor, size, shape, pattern, hasRing)
- **Comment**: content, authorNickname, parentId (대댓글)
- **Star**: giverNickname, unique(giverId, planetId)

이 피처에서 위 엔티티의 스키마/필드 변경은 없다.
