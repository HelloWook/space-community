# Feature Specification: 소셜 로그인

**Feature Branch**: `004-social-login`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "사용자의 소셜 로그인 기능을 지원하고 싶어요"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 소셜 계정으로 회원가입 및 로그인 (Priority: P1)

신규 사용자가 기존에 사용하던 소셜 계정(Google, GitHub)을 이용하여 별도의 비밀번호 설정 없이 빠르게 서비스에 가입하고 로그인한다.

**Why this priority**: 소셜 로그인의 핵심 가치로, 가입 허들을 낮추어 사용자 유입을 극대화한다. 이 기능 없이는 피처 자체가 성립하지 않는다.

**Independent Test**: 소셜 제공자 인증 흐름을 통해 신규 계정이 생성되고 서비스에 로그인된 상태가 되는지 확인

**Acceptance Scenarios**:

1. **Given** 서비스에 계정이 없는 사용자가 로그인 화면에 있을 때, **When** "Google로 로그인" 버튼을 클릭하고 Google 계정 인증을 완료하면, **Then** 자동으로 서비스 계정이 생성되고 로그인된 상태로 메인 화면에 진입한다
2. **Given** 이미 Google로 가입한 사용자가 로그인 화면에 있을 때, **When** "Google로 로그인" 버튼을 클릭하고 인증을 완료하면, **Then** 기존 계정으로 로그인되어 메인 화면에 진입한다
3. **Given** 사용자가 로그인 화면에 있을 때, **When** "GitHub로 로그인" 버튼을 클릭하고 GitHub 계정 인증을 완료하면, **Then** 서비스 계정이 생성되거나 기존 계정으로 로그인된다

---

### User Story 2 - 여러 소셜 계정 연동 (Priority: P2)

기존 사용자가 자신의 계정에 추가 소셜 제공자를 연동하여, 여러 소셜 계정 중 어느 것으로든 로그인할 수 있도록 한다.

**Why this priority**: 사용자 편의성을 높이고 계정 잠김 위험을 줄여 서비스 충성도를 강화한다. P1 이후에 구현 가능하다.

**Independent Test**: 로그인된 사용자가 설정 화면에서 다른 소셜 계정을 연동한 후, 해당 소셜 계정으로도 로그인할 수 있는지 확인

**Acceptance Scenarios**:

1. **Given** Google로 로그인한 사용자가 계정 설정 화면에 있을 때, **When** "GitHub 계정 연동" 버튼을 클릭하고 GitHub 인증을 완료하면, **Then** 동일 계정에 GitHub이 추가 연동되어, 이후 GitHub으로도 로그인할 수 있다
2. **Given** 이미 두 개의 소셜 계정이 연동된 사용자가 설정 화면에 있을 때, **When** 연동된 소셜 계정 중 하나의 "연동 해제" 버튼을 클릭하면, **Then** 해당 소셜 계정 연동이 해제되고, 최소 하나의 로그인 수단은 유지된다

---

### User Story 3 - 소셜 계정 이메일 충돌 처리 (Priority: P3)

사용자가 소셜 로그인 시 이미 다른 소셜 제공자로 가입된 동일 이메일이 존재하는 경우, Clerk가 자동으로 계정을 연동한다. 자동 연동 실패 시 에러를 안내한다.

**Why this priority**: Clerk가 인증된 이메일 기반 자동 연동을 지원하므로 구현 복잡도가 낮다. P1, P2가 완료된 후 에러 핸들링 위주로 처리한다.

**Independent Test**: 동일 이메일로 다른 소셜 제공자를 통해 로그인을 시도하여 자동 연동이 정상 동작하는지 확인

**Acceptance Scenarios**:

1. **Given** Google(email: user@example.com)로 가입된 사용자가 있을 때, **When** 동일 인증 이메일의 GitHub 계정으로 로그인을 시도하면, **Then** Clerk가 자동으로 계정을 연동하고 기존 계정으로 로그인된다
2. **Given** Clerk 자동 연동이 실패한 경우(미인증 이메일 등), **When** OAuth 콜백에서 에러가 반환되면, **Then** 사용자에게 에러 안내 메시지를 표시하고 다른 로그인 방법을 안내한다

---

### Edge Cases

- 소셜 제공자의 인증 서버가 응답하지 않거나 오류를 반환하면 어떻게 되는가?
- 사용자가 소셜 제공자에서 이메일 정보 공유를 거부하면 어떻게 되는가?
- 소셜 제공자 측에서 사용자의 계정이 삭제/정지된 경우 서비스 로그인에 어떤 영향이 있는가?
- 사용자가 마지막 남은 소셜 계정 연동을 해제하려고 시도하면 어떻게 되는가?
- 소셜 로그인 인증 도중 브라우저를 닫거나 네트워크가 끊기면 어떻게 되는가?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 Google, GitHub 두 가지 소셜 제공자를 통한 로그인을 지원해야 한다 (MUST)
- **FR-002**: 소셜 로그인 시 서비스에 계정이 없으면 자동으로 신규 계정을 생성해야 한다 (MUST)
- **FR-003**: 소셜 로그인 시 이미 계정이 있으면 기존 계정으로 로그인되어야 한다 (MUST)
- **FR-004**: 사용자는 로그인 화면에서 지원되는 소셜 제공자 버튼을 확인할 수 있어야 한다 (MUST). UI는 Clerk headless API(useSignIn, useSignUp, useUser 등)를 사용한 커스텀 구현
- **FR-005**: 소셜 제공자로부터 사용자의 이메일과 프로필 정보(이름, 프로필 이미지)를 가져와야 한다 (MUST)
- **FR-012**: Clerk Webhook(user.created, user.updated, user.deleted)을 수신하여 서비스 DB의 User 레코드를 동기화해야 한다 (MUST)
- **FR-006**: 로그인한 사용자는 계정 설정에서 추가 소셜 계정을 연동할 수 있어야 한다 (MUST)
- **FR-007**: 로그인한 사용자는 연동된 소셜 계정을 해제할 수 있어야 한다 (MUST)
- **FR-008**: 최소 하나의 로그인 수단이 유지되도록 마지막 소셜 연동 해제를 차단해야 한다 (MUST)
- **FR-009**: 소셜 로그인 시 동일 이메일로 이미 가입된 계정이 있으면 사용자에게 안내하고 연동 옵션을 제공해야 한다 (MUST)
- **FR-010**: 소셜 제공자 인증 실패 시 사용자에게 명확한 오류 메시지를 표시해야 한다 (MUST)
- **FR-011**: 소셜 제공자로부터 이메일 정보를 받지 못한 경우 사용자에게 이메일 입력을 요청해야 한다 (MUST)

### Key Entities

- **사용자(User)**: 서비스 이용자. clerkId(Clerk 사용자 ID), 이메일, 이름, 프로필 이미지 URL, 연동 소셜 제공자 목록을 서비스 DB에 저장
- **소셜 연동(Social Connection)**: 사용자와 소셜 제공자 간의 연결. Clerk가 관리하며, 서비스 DB에는 제공자 유형 목록만 동기화
- **소셜 제공자(Social Provider)**: 외부 인증 서비스(Google, GitHub). Clerk를 통해 OAuth 인증 처리

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자가 소셜 로그인 버튼 클릭부터 서비스 진입까지 10초 이내에 완료할 수 있다
- **SC-002**: 신규 사용자의 80% 이상이 소셜 로그인을 통해 가입한다
- **SC-003**: 소셜 로그인 시도 중 95% 이상이 성공적으로 완료된다
- **SC-004**: 이메일 충돌 발생 시 사용자의 90% 이상이 안내에 따라 계정 연동을 완료한다
- **SC-005**: 소셜 제공자 장애 시에도 다른 소셜 제공자를 통한 로그인은 영향받지 않는다

## Clarifications

### Session 2026-03-26

- Q: 인증 세션 관리 방식은? → A: Clerk 사용 (외부 인증 서비스). Next.js SDK(@clerk/nextjs)로 프론트엔드 처리, NestJS 백엔드에서 Clerk JWT 검증
- Q: 사용자 데이터 동기화 방식은? → A: Clerk Webhook 동기화. Clerk 이벤트(user.created, user.updated 등) 수신하여 서비스 DB에 User 레코드 동기화
- Q: Kakao 소셜 로그인 지원 범위는? → A: 이 피처에서 제외. Google, GitHub 두 제공자만 지원
- Q: UI 컴포넌트 방식은? → A: 커스텀 UI. Clerk headless API(useSignIn 등)를 사용하여 자체 디자인 UI 구현
- Q: 서비스 DB에 동기화할 사용자 필드 범위는? → A: 표준. Clerk 사용자 ID(clerkId), 이메일, 이름, 프로필 이미지 URL, 연동 소셜 제공자 목록

## Assumptions

- 사용자는 Google, GitHub 중 하나 이상의 소셜 계정을 이미 보유하고 있다
- Clerk를 외부 인증 서비스로 사용하며, 각 소셜 제공자 연동은 Clerk를 통해 처리한다
- 각 소셜 제공자의 OAuth2 인증 서비스가 정상적으로 운영되고 있다
- 사용자는 웹 브라우저를 통해 서비스에 접근한다 (모바일 앱은 별도 범위)
- 기존 사용자 시스템이 존재하며 이메일 기반으로 사용자를 식별한다
- 비밀번호 기반 로그인은 이 피처의 범위에 포함되지 않는다 (소셜 로그인만 다룸)
