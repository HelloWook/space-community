# Research: 은하계 게시판

**Feature Branch**: `001-galaxy-board` | **Date**: 2026-03-25

## 1. 3D 카메라 제어 및 우주 탐색

**Decision**: OrbitControls (@react-three/drei) + 커스텀 제약 조건
**Rationale**: 마우스/터치 기반 회전, 줌, 패닝을 기본 제공하며 damping, min/maxDistance 설정으로 우주 공간에 적합한 탐색 경험 구현 가능
**Alternatives Considered**:
- 커스텀 카메라 컨트롤러: 제어력은 높지만 관성, 터치 지원 등 수동 구현 부담
- MapControls: 2D 탐색에 적합하여 3D 우주 공간에는 부적합

## 2. 부드러운 카메라 전환 (은하계 진입/복귀)

**Decision**: useFrame + Vector3.lerp 보간 + 이징 함수
**Rationale**: R3F의 useFrame으로 프레임 단위 제어가 가능하고, OrbitControls의 target과 camera.position을 동시에 보간하여 부드러운 전환 구현. 전환 중 OrbitControls를 비활성화하여 충돌 방지
**Alternatives Considered**:
- GSAP/Tween.js: 강력하지만 R3F와의 통합이 비관용적
- Framer Motion 3D: 선언적이나 카메라 전환에는 useFrame이 더 직접적

## 3. 3D 성능 최적화 (행성 50개 + 별 최대 100개/행성)

**Decision**: InstancedMesh(별) + 일반 Mesh(행성) + 프러스텀 컬링
**Rationale**:
- 별(Star): InstancedMesh로 드로우 콜 1회로 축소 (최대 5,000개 별을 단일 호출로 렌더링)
- 행성(Planet): 개별 클릭 상호작용이 필요하므로 일반 Mesh 유지 (50개 수준은 성능 문제 없음)
- Three.js 내장 프러스텀 컬링으로 화면 밖 오브젝트 스킵
**Alternatives Considered**:
- Points/BufferGeometry(별): 더 가볍지만 개별 상호작용 어려움
- LOD: 현재 오브젝트 수(50+5000)에서는 과도한 최적화

## 4. 3D 오브젝트 클릭/호버 감지

**Decision**: R3F 내장 이벤트 시스템 (onClick, onPointerOver)
**Rationale**: R3F는 Raycaster를 자동 관리하며 JSX 이벤트 핸들러로 직관적 사용 가능. InstancedMesh의 경우 instanceId로 개별 인스턴스 식별
**Alternatives Considered**:
- 수동 Raycaster 설정: R3F가 이미 처리하므로 불필요
- 물리 기반 피킹: 단순 선택에 과도함

## 5. 카메라 드래그 중 의도치 않은 클릭 방지

**Decision**: 포인터 이동 임계값(5px) + 시간 기반 구분
**Rationale**: pointerDown 위치와 pointerUp 위치의 차이가 5px 이상이면 드래그로 판정하여 클릭 이벤트 무시. R3F의 onPointerUp에서 구현
**Alternatives Considered**:
- 더블클릭 방식: 워크플로우가 느려짐
- 수정자 키(Ctrl+클릭): 모바일 대응 불가

## 6. 3D 공간 내 페이지네이션

**Decision**: 커서 기반 페이지네이션 + 3D 공간 내 페이지 전환 애니메이션
**Rationale**:
- 커서 기반: 데이터 삽입 시에도 일관된 결과, 대량 데이터에서 offset보다 효율적
- 페이지 전환 시 기존 행성을 페이드아웃하고 새 행성을 페이드인하는 애니메이션 적용
- 페이지당 50개 행성 (스펙 요구사항)
**Alternatives Considered**:
- Offset 페이지네이션: 구현 단순하지만 동적 데이터에서 불일치 가능
- 무한 스크롤: 3D 공간에서는 방향성이 불명확

## 7. 2D UI 오버레이 (게시글 조회/작성)

**Decision**: Canvas 위 별도 DOM 레이어 (React 컴포넌트)
**Rationale**:
- 게시글 조회/작성은 복잡한 폼과 마크다운 렌더링이 필요하여 DOM이 적합
- 3D Canvas와 분리된 DOM 레이어로 관심사 분리
- drei의 Html 컴포넌트는 행성 이름 라벨 등 간단한 요소에만 사용
**Alternatives Considered**:
- drei Html 컴포넌트만 사용: 복잡한 폼/스크롤에 부적합
- 텍스처 기반 UI: 흐릿하고 상호작용 어려움

## 8. 프론트엔드 FSD 구조

**Decision**: Next.js App Router + FSD 레이어 (views로 pages 대체)
**Rationale**:
- `app/`: Next.js 라우트 정의만 담당
- `src/views/`: 화면 레이아웃 (FSD pages 대체, Next.js 충돌 방지)
- `src/entities/`: Galaxy, Planet, Star 도메인 모델 + 3D 표현 + API 훅
- `src/features/`: 은하계 탐색, 게시글 작성, 별 부여 등 사용자 상호작용
- `src/shared/`: 유틸리티, UI 프리미티브, API 클라이언트
- import 방향: app → views → widgets → features → entities → shared (역방향 금지)

**3D 컴포넌트 배치**:
- `entities/{entity}/ui/`: 엔티티별 3D 메시 (Galaxy3D, Planet3D, Star3D)
- `features/galaxy-viewer/`: 3D 씬 조합 + 카메라 제어 + 상호작용
- `shared/ui/`: Canvas3D 래퍼, 공통 3D 유틸리티

## 9. 상태 관리 (Zustand + TanStack Query)

**Decision**: Zustand(클라이언트 상태) + TanStack Query(서버 상태) 분리
**Rationale**:
- Zustand: 카메라 상태, 선택된 은하계/행성, UI 모드 등 클라이언트 전용 상태
- TanStack Query: 은하계/행성/별 데이터의 서버 캐시, 자동 리페치
- 엔티티별 API 훅: `entities/{entity}/api/hooks.ts`
- 쿼리 키 팩토리: `shared/api/queryKeys.ts`에서 중앙 관리
**Alternatives Considered**:
- Redux: Zustand 대비 보일러플레이트 과다
- Context API: 리렌더링 최적화 어려움

## 10. 백엔드 헥사고날 아키텍처

**Decision**: domain/ → application/ → infrastructure/ 3계층 분리
**Rationale**:
- `domain/`: 엔티티, 값 객체, 포트(인터페이스) — 외부 의존성 금지
- `application/`: 유스케이스 서비스, DTO, 매퍼
- `infrastructure/`: NestJS 컨트롤러, Prisma 리포지토리, 외부 서비스
- NestJS DI로 포트-어댑터 바인딩 (`@Inject(GALAXY_REPOSITORY)`)
- Prisma 모델 → 도메인 엔티티 변환은 매퍼가 담당
**Alternatives Considered**:
- 단순 레이어드 아키텍처: 프레임워크 누수 방지 불가
- 기능 기반 구조: 도메인 경계 불명확

## 11. 동시 별 부여 처리 (데이터 정합성)

**Decision**: Prisma 원자적 increment 연산
**Rationale**:
- `prisma.planet.update({ data: { starCount: { increment: 1 } } })`: DB 레벨에서 원자적 처리
- 상한 검증: increment 전 현재 count 확인 후 100 미만일 때만 수행
- 트랜잭션 불필요 (단일 필드 원자적 업데이트)
**Alternatives Considered**:
- 낙관적 잠금(version 필드): 단순 increment에는 과도함
- Redis 카운터: 추가 인프라 필요, 결과적 일관성 문제

## 12. API 유효성 검증

**Decision**: class-validator + class-transformer (NestJS 표준)
**Rationale**: NestJS ValidationPipe과 네이티브 통합, whitelist/transform 자동 처리. 프론트엔드와 공유하는 스키마는 `@galaxy-board/types` 패키지의 zod 스키마 활용
**Alternatives Considered**:
- Zod만 사용: NestJS 파이프 통합 이점 상실
- Joi: TypeScript 타입 추론 약함

## 13. WebGL 미지원 브라우저 대응

**Decision**: Canvas 렌더링 전 WebGL 지원 여부 확인 + 폴백 메시지
**Rationale**: `THREE.WebGLRenderer` 생성 전에 `WebGLRenderingContext` 지원 확인. 미지원 시 "이 브라우저는 3D 콘텐츠를 지원하지 않습니다" 안내 메시지 표시
**Alternatives Considered**:
- 2D 폴백 UI: 개발 비용 대비 타겟 사용자(모던 브라우저)에서 불필요
