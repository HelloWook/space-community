// 시드 데이터 스크립트 — 샘플 은하계 + 다양한 외형 행성 생성
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

// 다양한 외형을 가진 샘플 행성
const samplePlanets = [
  {
    title: 'React 19 새 기능',
    content: '# React 19\n\nServer Actions와 새로운 훅들을 소개합니다.',
    authorNickname: '개발자김',
    mainColor: '#FF6B35',
    subColor: '#004E64',
    size: 'LARGE',
    shape: 'SPHERE',
    pattern: 'CLOUD',
    hasRing: true,
  },
  {
    title: 'TypeScript 팁',
    content: '유용한 TypeScript 패턴을 공유합니다.',
    authorNickname: '타입장인',
    mainColor: '#3178C6',
    subColor: '#1A1A2E',
    size: 'MEDIUM',
    shape: 'DODECAHEDRON',
    pattern: 'SMOOTH',
    hasRing: false,
  },
  {
    title: 'Three.js 셰이더',
    content: 'GLSL 셰이더로 멋진 이펙트를 만들어봅시다.',
    authorNickname: '3D마스터',
    mainColor: '#00FF88',
    subColor: '#FF00FF',
    size: 'SMALL',
    shape: 'TORUS',
    pattern: 'STRIPE',
    hasRing: false,
  },
  {
    title: 'Rust vs Go',
    content: '시스템 프로그래밍 언어 비교 분석.',
    authorNickname: '시스템러버',
    mainColor: '#DEA584',
    subColor: '#00ADD8',
    size: 'LARGE',
    shape: 'OCTAHEDRON',
    pattern: 'CRATER',
    hasRing: true,
  },
  {
    title: 'CSS 트릭',
    content: '알아두면 좋은 CSS 기법들.',
    authorNickname: '스타일러',
    mainColor: '#E44D26',
    subColor: '#264DE4',
    size: 'MEDIUM',
    shape: 'CONE',
    pattern: 'SMOOTH',
    hasRing: false,
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

    // 첫 번째 은하계(기술)에만 샘플 행성 추가
    if (galaxy.name === '기술') {
      const existingCount = await prisma.planet.count({
        where: { galaxyId: created.id },
      });

      if (existingCount === 0) {
        for (const planet of samplePlanets) {
          await prisma.planet.create({
            data: {
              ...planet,
              galaxyId: created.id,
              positionX: Math.random() * 20 - 10,
              positionY: Math.random() * 20 - 10,
              positionZ: Math.random() * 20 - 10,
            },
          });
          console.log(`  행성 생성됨: ${planet.title} (${planet.shape}, ${planet.mainColor})`);
        }
      }
    }
  }

  console.log('시드 데이터 생성 완료.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
