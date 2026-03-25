# Data Model: 프로젝트 초기 세팅

이 기능은 프로젝트 구조 세팅이므로 비즈니스 엔티티를 직접 정의하지 않는다.
후속 기능(001-galaxy-board)에서 Galaxy, Planet, Star 엔티티가 정의될 예정이다.

## 초기 데이터베이스 설정

### PostgreSQL 스키마

- 데이터베이스명: `galaxy_board`
- 기본 사용자: 환경 변수로 관리 (`DATABASE_URL`)
- Prisma 마이그레이션으로 스키마 관리

### Prisma 초기 설정

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

후속 기능에서 모델을 추가할 때 `prisma migrate dev`로 마이그레이션을 생성한다.
