# Research: 인공위성 댓글 시스템

## Decision 1: 댓글 데이터 모델 구조

**Decision**: Comment 모델을 Planet-Star 패턴과 동일하게 별도 모델로 생성. 대댓글은 자기참조(parentId)로 구현.

**Rationale**:
- 기존 Star 모델 패턴과 일관성 유지
- 자기참조로 1단계 대댓글을 간단히 구현 (parentId nullable)
- commentCount 필드를 Planet에 추가하여 Star의 starCount 패턴 재사용

**Alternatives considered**:
- 별도 Reply 모델: 불필요한 복잡성, 1단계만 지원하므로 자기참조로 충분
- JSON 필드에 댓글 저장: 쿼리/페이지네이션 어려움, RDBMS 활용 불가

## Decision 2: 인공위성 3D 렌더링 전략

**Decision**: InstancedMesh 기반의 Satellite3D 컴포넌트를 Star3D와 유사하게 구현. 개별 인스턴스에 클릭 이벤트를 위해 raycasting 사용.

**Rationale**:
- Star3D가 이미 InstancedMesh + Fibonacci sphere 분포를 사용하여 검증된 패턴
- 50개 인공위성은 InstancedMesh로 1 draw call에 렌더링 가능
- 혜성 꼬리 이펙트는 Trail 또는 Line 컴포넌트로 구현

**Alternatives considered**:
- 개별 Mesh: 50개 × draw call = 성능 저하
- Sprite: 3D 형태(원통/큐브) 표현 불가
- Points: 클릭 이벤트 처리 어려움

## Decision 3: 인공위성 클릭 → 댓글 포커싱 연결

**Decision**: 인공위성의 인덱스를 댓글 배열 인덱스와 1:1 매핑. 클릭 시 instanceId를 감지하여 해당 댓글 ID를 Zustand 스토어에 저장, 사이드 패널에서 해당 댓글로 scrollIntoView.

**Rationale**:
- InstancedMesh의 instanceId는 클릭된 인스턴스를 정확히 식별
- Zustand 스토어로 3D 씬과 UI 패널 간 상태 공유
- scrollIntoView는 브라우저 네이티브 API로 추가 라이브러리 불필요

**Alternatives considered**:
- Context API: R3F 캔버스와 DOM 간 공유 어려움
- 이벤트 버스: 디버깅 어려움, YAGNI
- CSS scroll-snap: 정밀한 댓글 포커싱에 부적합

## Decision 4: 혜성 꼬리 이펙트 구현

**Decision**: @react-three/drei의 Trail 컴포넌트 또는 커스텀 shader를 사용하여 인공위성의 궤적을 표현.

**Rationale**:
- Trail은 이미 drei에 포함되어 추가 의존성 없음
- 궤적 길이와 색상을 props로 조절 가능
- InstancedMesh와 별도로 trail mesh를 렌더링하여 성능 분리

**Alternatives considered**:
- 파티클 시스템: 50개 인공위성 × 파티클 = 과도한 오브젝트
- 후처리 이펙트(Bloom): 별과 인공위성 모두에 적용되어 구분 어려움

## Decision 5: 댓글 인증 정책

**Decision**: 006-auth-required 피처에서 회원 전용으로 전환 예정이므로, 이 피처에서는 optional auth를 기본으로 구현하되 006 머지 후 자동으로 필수 인증이 적용되도록 한다.

**Rationale**:
- 005 → 006 순서로 머지하면 006의 ClerkAuthGuard 필수 전환이 댓글에도 적용
- 005에서 optional auth로 구현하면 독립적으로 테스트 가능
- 스펙에 명시된 "비회원 닉네임 댓글 허용"은 006 이전 동작

**Alternatives considered**:
- 처음부터 필수 인증: 006과 의존성 생김, 독립 구현 불가
