// 시드 데이터 스크립트 — 샘플 은하계 생성
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// 샘플 은하계 데이터 (한글 이름, 3D 공간에 분산 배치)
const galaxies = [
  {
    name: '기술',
    description: '기술 이야기',
    positionX: -15,
    positionY: 8,
    positionZ: -5,
  },
  {
    name: '일상',
    description: '일상 이야기',
    positionX: 12,
    positionY: -4,
    positionZ: 3,
  },
  {
    name: '게임',
    description: '게임 이야기',
    positionX: 5,
    positionY: 14,
    positionZ: -10,
  },
  {
    name: '음악',
    description: '음악 이야기',
    positionX: -8,
    positionY: -10,
    positionZ: 7,
  },
];

async function main() {
  console.log('시드 데이터 생성 시작...');

  for (const galaxy of galaxies) {
    // upsert로 중복 실행 시에도 안전하게 처리
    const created = await prisma.galaxy.upsert({
      where: { name: galaxy.name },
      update: {},
      create: galaxy,
    });

    console.log(`은하계 생성됨: ${created.name} (${created.id})`);
  }

  console.log('시드 데이터 생성 완료.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
