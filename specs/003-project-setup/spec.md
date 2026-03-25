# Feature Specification: 프로젝트 초기 세팅

**Feature Branch**: `003-project-setup`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "프로젝트 초기 세팅 - FSD 프론트엔드, 헥사고날 백엔드 폴더 구조, Three.js 의존성, 테스트 환경 구성"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 프론트엔드 프로젝트 구조 세팅 (Priority: P1)

개발자가 프론트엔드 코드를 작성하려 할 때, FSD(Feature-Sliced Design) 폴더 구조가 갖춰져 있어 정해진 레이어에 코드를 배치할 수 있다. 3D 렌더링 라이브러리가 설치되어 있어 즉시 3D 장면 개발을 시작할 수 있다.

**Why this priority**: 프론트엔드가 이 프로젝트의 핵심 사용자 인터페이스이며, 3D 렌더링 환경이 준비되지 않으면 어떤 기능도 개발할 수 없다.

**Independent Test**: 개발 서버를 실행하여 빈 3D 장면이 브라우저에 렌더링되면 테스트 통과.

**Acceptance Scenarios**:

1. **Given** 프로젝트를 클론한 상태에서, **When** 의존성 설치 후 개발 서버를 실행하면, **Then** 브라우저에서 빈 3D 장면이 표시된다
2. **Given** FSD 폴더 구조가 생성된 상태에서, **When** 각 레이어(app, pages, widgets, features, entities, shared) 디렉토리를 확인하면, **Then** 모든 레이어 디렉토리와 index 파일이 존재한다
3. **Given** 프론트엔드 프로젝트에서, **When** 린팅/포매팅 도구를 실행하면, **Then** 오류 없이 통과한다

---

### User Story 2 - 백엔드 프로젝트 구조 세팅 (Priority: P1)

개발자가 백엔드 코드를 작성하려 할 때, 헥사고날 아키텍처 폴더 구조가 갖춰져 있어 도메인, 애플리케이션, 인프라스트럭처 레이어에 맞게 코드를 배치할 수 있다. 서버를 실행하여 기본 상태 확인 엔드포인트에 응답할 수 있다.

**Why this priority**: 백엔드가 데이터 저장과 API 제공을 담당하며, 프론트엔드와 함께 프로젝트의 기반이 된다.

**Independent Test**: 백엔드 서버를 실행하여 상태 확인 엔드포인트가 응답하면 테스트 통과.

**Acceptance Scenarios**:

1. **Given** 프로젝트를 클론한 상태에서, **When** 의존성 설치 후 백엔드 서버를 실행하면, **Then** 상태 확인 엔드포인트가 정상 응답한다
2. **Given** 헥사고날 폴더 구조가 생성된 상태에서, **When** domain, application, infrastructure 디렉토리를 확인하면, **Then** 모든 레이어 디렉토리가 존재한다
3. **Given** 백엔드 프로젝트에서, **When** 린팅/포매팅 도구를 실행하면, **Then** 오류 없이 통과한다

---

### User Story 3 - 테스트 환경 구성 (Priority: P1)

개발자가 TDD로 개발을 시작하려 할 때, 프론트엔드와 백엔드 모두 테스트 프레임워크가 설치되고 설정되어 있어 즉시 테스트를 작성하고 실행할 수 있다. 샘플 테스트가 포함되어 테스트 실행 방법을 확인할 수 있다.

**Why this priority**: 헌법에 TDD가 NON-NEGOTIABLE로 명시되어 있으며, 테스트 환경 없이는 어떤 기능 구현도 시작할 수 없다.

**Independent Test**: 프론트엔드/백엔드 각각에서 샘플 테스트를 실행하여 통과하면 테스트 통과.

**Acceptance Scenarios**:

1. **Given** 프론트엔드 프로젝트에서, **When** 테스트 실행 명령을 수행하면, **Then** 샘플 테스트가 통과한다
2. **Given** 백엔드 프로젝트에서, **When** 테스트 실행 명령을 수행하면, **Then** 샘플 테스트가 통과한다
3. **Given** 테스트 환경이 구성된 상태에서, **When** 의도적으로 실패하는 테스트를 작성하면, **Then** 실패 결과가 명확하게 보고된다

---

### User Story 4 - 통합 개발 환경 (Priority: P2)

개발자가 프론트엔드와 백엔드를 동시에 실행하려 할 때, 루트에서 단일 명령으로 양쪽 개발 서버를 동시에 시작할 수 있다.

**Why this priority**: 개발 편의성을 높이지만, 개별 서버 실행으로도 개발 가능하므로 후순위이다.

**Independent Test**: 루트에서 단일 명령 실행 시 프론트엔드/백엔드 서버가 동시에 시작되면 테스트 통과.

**Acceptance Scenarios**:

1. **Given** 프로젝트 루트에서, **When** 통합 실행 명령을 수행하면, **Then** 프론트엔드와 백엔드 개발 서버가 동시에 시작된다

---

### Edge Cases

- Node.js 버전이 최소 요구사항보다 낮은 경우 명확한 에러 메시지를 표시한다
- 의존성 설치 실패 시 어떤 패키지에서 문제가 발생했는지 식별 가능해야 한다
- 포트 충돌 시 대체 포트를 사용하거나 안내 메시지를 표시한다

## Clarifications

### Session 2026-03-25

- Q: 백엔드 언어 및 기술 스택은? → A: TypeScript 통일. 프론트엔드 Next.js, 백엔드 NestJS, DB PostgreSQL, Docker + Docker Compose로 전체 서비스 관리
- Q: 모노레포 패키지 매니저는? → A: yarn workspaces

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 프로젝트는 모노레포 구조로 프론트엔드(Next.js)와 백엔드(NestJS)를 포함하며, TypeScript를 공용 언어로 사용해야 한다
- **FR-002**: 프론트엔드는 FSD 레이어 구조(app, pages, widgets, features, entities, shared)를 갖추어야 한다
- **FR-003**: 백엔드는 헥사고날 아키텍처 구조(domain, application, infrastructure)를 갖추어야 한다
- **FR-004**: 3D 렌더링 라이브러리가 프론트엔드 의존성에 포함되어야 한다
- **FR-005**: 프론트엔드와 백엔드 각각에 테스트 프레임워크가 설치되고 설정되어야 한다
- **FR-006**: 코드 린팅 및 포매팅 도구가 설정되어야 한다
- **FR-007**: 프론트엔드 개발 서버 실행 시 빈 3D 장면이 브라우저에 렌더링되어야 한다
- **FR-008**: 백엔드 서버 실행 시 상태 확인 엔드포인트가 응답해야 한다
- **FR-009**: Docker Compose 또는 모노레포 스크립트를 통해 프론트엔드와 백엔드를 루트에서 동시에 실행할 수 있어야 한다
- **FR-010**: 각 프로젝트에 샘플 테스트가 포함되어 테스트 환경 동작을 검증할 수 있어야 한다
- **FR-011**: Docker Compose를 통해 프론트엔드, 백엔드, PostgreSQL을 단일 명령으로 실행할 수 있어야 한다
- **FR-012**: PostgreSQL 데이터베이스가 Docker 컨테이너로 제공되어야 한다
- **FR-013**: 프론트엔드와 백엔드 간 공유 타입/인터페이스를 위한 공용 패키지가 모노레포에 포함되어야 한다

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 프로젝트 클론 후 의존성 설치까지 3분 이내에 완료된다
- **SC-002**: 개발 서버 시작부터 브라우저에 3D 장면이 표시되기까지 10초 이내이다
- **SC-003**: 프론트엔드/백엔드 전체 샘플 테스트 실행이 5초 이내에 완료된다
- **SC-004**: 새 개발자가 README만 읽고 10분 이내에 개발 환경을 구동할 수 있다

## Assumptions

- Node.js LTS 버전(20.x 이상)을 사용한다
- 패키지 매니저: yarn workspaces를 사용하여 모노레포를 관리한다
- 프론트엔드: Next.js, 백엔드: NestJS, DB: PostgreSQL
- Docker + Docker Compose로 개발/배포 환경을 컨테이너화한다
- FSD 구조에서 processes 레이어는 선택적이며, 필요 시 추가한다
- 이 세팅은 001-galaxy-board, 002-planet-customization 등 모든 후속 기능의 기반이 된다
