# 종합 요구사항 품질 Checklist: 프로젝트 초기 세팅

**Purpose**: 프로젝트 세팅 스펙/plan 전반의 요구사항 완성도, 명확성, 일관성 검증
**Created**: 2026-03-25
**Feature**: [spec.md](../spec.md)

## 요구사항 완성도 (Completeness)

- [ ] CHK001 - FSD 각 레이어(app, pages, widgets, features, entities, shared)별 역할과 포함해야 할 파일이 명시되어 있는가? [Completeness, Spec §FR-002]
- [ ] CHK002 - 헥사고날 아키텍처의 각 레이어(domain, application, infrastructure)별 포함 항목과 의존성 규칙이 문서화되어 있는가? [Completeness, Spec §FR-003]
- [ ] CHK003 - 공유 패키지(@galaxy-board/types)에 포함될 초기 타입/인터페이스 범위가 정의되어 있는가? [Completeness, Spec §FR-013]
- [ ] CHK004 - Docker Compose의 각 서비스(web, api, postgres)별 포트, 환경변수, 볼륨 마운트 요구사항이 명시되어 있는가? [Completeness, Spec §FR-011]
- [ ] CHK005 - ESLint/Prettier 공유 설정에서 프론트엔드용과 백엔드용 규칙 차이가 문서화되어 있는가? [Completeness, Spec §FR-006]
- [ ] CHK006 - 프론트엔드/백엔드 각각의 샘플 테스트가 검증해야 할 항목이 정의되어 있는가? [Completeness, Spec §FR-010]
- [ ] CHK007 - README 문서에 포함되어야 할 섹션(설치, 실행, 테스트, 구조 설명)이 요구사항으로 명시되어 있는가? [Gap, SC-004 관련]

## 요구사항 명확성 (Clarity)

- [ ] CHK008 - "빈 3D 장면"의 구체적인 의미가 정의되어 있는가? (검은 배경 + 카메라만? 그리드? 축 표시?) [Clarity, Spec §FR-007]
- [ ] CHK009 - "상태 확인 엔드포인트가 정상 응답한다"의 응답 형식과 상태 코드가 명시되어 있는가? [Clarity, Spec §FR-008]
- [ ] CHK010 - FSD 레이어 간 import 규칙(상위→하위 단방향)이 스펙에 명시되어 있는가, 아니면 헌법에만 있는가? [Clarity, Spec §FR-002]
- [ ] CHK011 - "의존성 설치 후 개발 서버를 실행"하는 구체적 명령어 형식이 정의되어 있는가? [Clarity, US1 수락 시나리오]
- [ ] CHK012 - 헥사고날 아키텍처에서 "domain은 외부 의존성을 가질 수 없다"의 범위가 명확한가? (NestJS 데코레이터 포함 여부) [Clarity, Spec §FR-003]

## 요구사항 일관성 (Consistency)

- [ ] CHK013 - 스펙의 Node.js 버전 요구사항(20.x 이상)과 plan의 결정(Node.js 22)이 일관되는가? [Consistency, Spec §Assumptions vs Plan §Technical Context]
- [ ] CHK014 - FR-009(모노레포 스크립트 또는 Docker Compose)와 FR-011(Docker Compose로 단일 명령)의 중복/충돌이 없는가? [Consistency, Spec §FR-009 vs §FR-011]
- [ ] CHK015 - US4(루트에서 동시 실행)의 범위가 FR-009/FR-011과 명확히 구분되는가? (Docker vs 로컬) [Consistency, Spec §US4 vs §FR-009]
- [ ] CHK016 - FSD 레이어 목록이 스펙(app, pages, widgets, features, entities, shared)과 헌법(app → processes → pages → widgets → features → entities → shared)에서 일관되는가? [Consistency, Spec §FR-002 vs Constitution]

## 수락 기준 품질 (Acceptance Criteria)

- [ ] CHK017 - SC-001("3분 이내 의존성 설치")의 측정 조건(네트워크 환경, 캐시 유무)이 정의되어 있는가? [Measurability, Spec §SC-001]
- [ ] CHK018 - SC-004("10분 이내 개발 환경 구동")의 전제 조건(Docker 설치 여부, OS 등)이 명시되어 있는가? [Measurability, Spec §SC-004]
- [ ] CHK019 - "린팅/포매팅 도구를 실행하면 오류 없이 통과한다"의 대상 범위(초기 생성 파일만? 모든 설정 파일?)가 명확한가? [Measurability, US1/US2 수락 시나리오]

## 시나리오 커버리지 (Scenario Coverage)

- [ ] CHK020 - Docker 없이 로컬에서만 개발하는 시나리오의 요구사항이 정의되어 있는가? (PostgreSQL 로컬 설치 or Docker만?) [Coverage, Gap]
- [ ] CHK021 - yarn workspaces에서 패키지 간 의존성 변경 시 재빌드 시나리오가 명시되어 있는가? [Coverage, Gap]
- [ ] CHK022 - Prisma 마이그레이션 초기 실행 및 리셋 시나리오의 요구사항이 정의되어 있는가? [Coverage, Gap]
- [ ] CHK023 - 프론트엔드↔백엔드 간 API 통신 기본 설정(CORS, 프록시 등) 요구사항이 있는가? [Coverage, Gap]

## 엣지 케이스 커버리지 (Edge Cases)

- [ ] CHK024 - Docker Compose 서비스 시작 순서(postgres → api → web)와 헬스체크 의존성 요구사항이 명시되어 있는가? [Edge Case, Spec §FR-011]
- [ ] CHK025 - yarn workspaces 의존성 호이스팅 충돌 시 대응 방안이 문서화되어 있는가? [Edge Case, Gap]
- [ ] CHK026 - .env 파일 누락 시 기본값 또는 에러 처리 요구사항이 정의되어 있는가? [Edge Case, Gap]
- [ ] CHK027 - Docker 볼륨의 node_modules 충돌(호스트 vs 컨테이너) 방지 요구사항이 있는가? [Edge Case, Gap]

## 비기능 요구사항 (Non-Functional)

- [ ] CHK028 - .env, 자격 증명 등 민감 정보의 gitignore 요구사항이 명시되어 있는가? [Security, Gap]
- [ ] CHK029 - Docker 이미지의 보안 기본 설정(non-root 사용자, alpine 베이스 등) 요구사항이 있는가? [Security, Gap]
- [ ] CHK030 - 모노레포에서 TypeScript strict 모드 활성화 요구사항이 명시되어 있는가? [Quality, Gap]

## 의존성 & 가정 (Dependencies & Assumptions)

- [ ] CHK031 - yarn workspaces 선택의 근거와 제한사항이 문서화되어 있는가? [Assumption, Spec §Clarifications]
- [ ] CHK032 - Prisma 선택이 스펙에 반영되어 있는가, 아니면 plan에만 존재하는가? [Traceability, Plan §Technical Context]
- [ ] CHK033 - 후속 기능(001-galaxy-board, 002-planet-customization)과의 의존 관계가 양방향으로 문서화되어 있는가? [Dependency, Spec §Assumptions]

## Notes

- 항목 완료 시 `[x]`로 체크
- [Gap] 마커 항목은 스펙 보완이 필요한 영역
- [Consistency] 항목은 스펙↔헌법↔plan 간 정합성 확인 필요
