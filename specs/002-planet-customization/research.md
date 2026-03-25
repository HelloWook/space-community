# Research: 행성 커스터마이징

**Feature**: 002-planet-customization | **Date**: 2026-03-25

## 1. Three.js 절차적 셰이더 패턴

**Decision**: GLSL ShaderMaterial + Simplex Noise로 4가지 표면 패턴 구현

**Rationale**:
- 텍스처 파일 로딩 불필요 — 번들 크기 절감, 로딩 지연 없음
- 색상(mainColor, subColor)과 자연스럽게 블렌딩 가능
- Three.js ShaderMaterial은 @react-three/fiber와 완전 호환
- Simplex Noise는 자연스러운 행성 표면 패턴 생성에 적합 (크레이터, 구름, 줄무늬)

**Alternatives considered**:
- 텍스처 이미지 매핑: 에셋 관리 부담, 색상 커스터마이징과 조합 어려움
- 단순 색상 변화: 시각적 풍부함 부족

**패턴별 구현 전략**:
- SMOOTH: noise 없이 mainColor → subColor 그라디언트
- CRATER: 고주파 Simplex Noise로 울퉁불퉁한 표면 (displacement + 어두운 점)
- STRIPE: UV.y 좌표 기반 sin 함수 줄무늬 (mainColor/subColor 교차)
- CLOUD: 저주파 Simplex Noise로 부드러운 구름 패턴 (반투명 레이어)

## 2. Three.js 기본 지오메트리 8종 매핑

**Decision**: Three.js 내장 BufferGeometry 클래스 직접 사용

**Rationale**:
- 외부 에셋 불필요, 즉시 렌더링
- 모든 지오메트리가 동일한 Material 인터페이스 공유 → 셰이더 재사용 가능
- @react-three/fiber에서 JSX로 선언적 사용 가능

**매핑 테이블**:

| Shape Enum | Three.js Geometry | 세그먼트 |
|------------|-------------------|----------|
| SPHERE | SphereGeometry | 32, 32 |
| BOX | BoxGeometry | 1, 1, 1 |
| TETRAHEDRON | TetrahedronGeometry | 0 |
| OCTAHEDRON | OctahedronGeometry | 0 |
| DODECAHEDRON | DodecahedronGeometry | 0 |
| TORUS | TorusGeometry | 1, 0.4, 16, 32 |
| CYLINDER | CylinderGeometry | 1, 1, 2, 32 |
| CONE | ConeGeometry | 1, 2, 32 |

**Alternatives considered**:
- 커스텀 .glb 모델: 디자이너 필요, 로딩 오버헤드, 현재 팀 규모에 과도

## 3. HEX 컬러 피커 구현

**Decision**: react-colorful 라이브러리 사용

**Rationale**:
- 경량 (2.8KB gzipped), 의존성 없음
- HEX 입력 + 시각적 피커 동시 제공
- shadcn/ui Popover와 조합하여 UI 통합 용이
- 접근성 지원 (키보드 네비게이션, ARIA)

**Alternatives considered**:
- 네이티브 `<input type="color">`: 브라우저별 UI 불일치, 커스터마이징 불가
- react-color: 번들 크기 큼 (13KB+), 과도한 기능

## 4. Planet 테이블 마이그레이션 전략

**Decision**: Prisma migrate로 컬럼 추가, 기존 행성에 기본값 적용

**Rationale**:
- 기존 Planet 행이 있으므로 NOT NULL + DEFAULT 필요
- 기본값: mainColor='#4A90D9', subColor='#2C5F8A', size='MEDIUM', shape='SPHERE', pattern='SMOOTH', hasRing=false
- Prisma enum 대신 String + @default 사용 (enum 변경 시 마이그레이션 불필요)

**Alternatives considered**:
- Prisma native enum: PostgreSQL ALTER TYPE 필요, 값 추가 시 마이그레이션 복잡
- JSON 컬럼: 타입 안전성 부족, 쿼리/인덱싱 어려움

## 5. 성능 고려사항

**Decision**: ShaderMaterial 인스턴스 캐싱 + 지오메트리 재사용

**Rationale**:
- 같은 패턴의 ShaderMaterial은 uniform만 다르므로 클론하여 재사용
- 지오메트리는 형태별 1개만 생성하여 공유 (React.useMemo)
- 50개 행성 기준 draw call 최적화: 같은 형태끼리 그룹핑은 과도 → 개별 mesh로 충분 (50 draw calls은 WebGL에서 무리 없음)

**Benchmark 기준**:
- SC-004: 커스터마이징된 행성 50개 은하계에서 30fps 이상
- 셰이더 컴파일: 패턴 4종 × 첫 렌더 시 1회, 이후 캐시됨
