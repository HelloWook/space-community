# Research: 회원 전용 서비스 전환

## Decision 1: Optional Auth → Required Auth 전환 전략

**Decision**: 쓰기 엔드포인트의 `OptionalClerkAuthGuard`를 `ClerkAuthGuard`로 교체. 읽기 엔드포인트는 가드 없이 유지.

**Rationale**:
- 기존 `ClerkAuthGuard`가 이미 구현되어 있으므로 새 코드 작성 불필요
- `OptionalClerkAuthGuard`는 읽기 전용 엔드포인트에서 여전히 유용할 수 있음 (사용자 식별은 하되 차단하지 않는 경우)
- 현재는 읽기에도 사용하지 않으므로 제거 가능하나, 향후 "내 게시글" 필터 등에 필요할 수 있어 유지

**Alternatives considered**:
- 미들웨어 레벨에서 전역 인증: 과도한 변경, 읽기까지 차단됨
- 커스텀 데코레이터로 인증 필수 표시: 기존 NestJS 가드 패턴과 불일치

## Decision 2: 닉네임 필드 처리 전략

**Decision**: DB 스키마에서 `authorNickname`, `giverNickname` 필드를 유지하되, 새 데이터 생성 시 `User.name`을 자동으로 채움. DTO에서 클라이언트 입력 필드는 제거.

**Rationale**:
- 기존 데이터 하위 호환을 위해 DB 컬럼 삭제 불가
- 표시할 때는 `authorId`가 있으면 User 관계에서 이름을 가져오고, 없으면 기존 닉네임 사용
- 새 게시글/별 생성 시 서버에서 `User.name`을 닉네임 필드에도 저장하면, 기존 조회 로직 변경 최소화

**Alternatives considered**:
- 닉네임 필드 완전 제거 + 마이그레이션: 기존 데이터 파괴 위험, 롤백 어려움
- nullable로 전환만: 이미 Star.giverNickname은 required인데, 빈 문자열 허용은 깔끔하지 않음

## Decision 3: 별주기 중복 제한 구현 전략

**Decision**: `Star` 모델에 `@@unique([giverId, planetId])` 제약 추가. 서비스 레이어에서도 사전 검증.

**Rationale**:
- DB 레벨 unique 제약으로 동시 요청 시에도 중복 방지 보장
- 서비스 레이어 사전 검증으로 명확한 에러 메시지 제공
- 기존 데이터에 `giverId`가 null인 별은 unique 제약에 영향 없음 (null은 unique 비교에서 제외)

**Alternatives considered**:
- 서비스 레이어 검증만: 동시 요청 시 레이스 컨디션 가능
- DB 제약만: 에러 메시지가 불친절 (Prisma 에러 → 사용자 메시지 변환 필요)

## Decision 4: 프론트엔드 인증 체크 패턴

**Decision**: Clerk의 `useAuth()` 훅으로 로그인 상태 확인. 비로그인 시 쓰기 UI 비활성화 + "로그인이 필요합니다" 메시지 표시. 클릭 시 `/sign-in` 리다이렉트.

**Rationale**:
- `@clerk/nextjs`의 `useAuth()`는 이미 프로젝트에 설치됨
- 서버 사이드 미들웨어에서도 이미 Clerk가 설정되어 있음
- API 호출 시에도 Clerk가 자동으로 인증 헤더를 포함

**Alternatives considered**:
- 쓰기 UI를 완전히 숨김: 기능 존재 자체를 모르게 되어 회원가입 동기 부여 약화
- 모달로 로그인 유도: 추가 UI 구현 필요, YAGNI 위반
