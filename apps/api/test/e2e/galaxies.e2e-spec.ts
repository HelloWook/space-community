// Galaxy API e2e 테스트

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { GalaxyModule } from '../../src/galaxy.module';
import { GALAXY_REPOSITORY } from '../../src/domain/ports/galaxy-repository.port';
import { PLANET_REPOSITORY } from '../../src/domain/ports/planet-repository.port';
import { GalaxyEntity } from '../../src/domain/entities/galaxy.entity';
import { HttpExceptionFilter } from '../../src/infrastructure/api/filters/http-exception.filter';

describe('Galaxies API (e2e)', () => {
  let app: INestApplication;

  // 테스트용 Galaxy 데이터
  const testGalaxy = GalaxyEntity.create({
    id: 'galaxy-1',
    name: '프론트엔드',
    description: '프론트엔드 관련 게시판',
    position: { x: 10, y: 20, z: 30 },
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });

  // Mock 리포지토리
  const mockGalaxyRepository = {
    findAll: jest.fn().mockResolvedValue([testGalaxy]),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockPlanetRepository = {
    findByGalaxyId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    countByGalaxyId: jest.fn().mockResolvedValue(3),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GalaxyModule],
    })
      .overrideProvider(GALAXY_REPOSITORY)
      .useValue(mockGalaxyRepository)
      .overrideProvider(PLANET_REPOSITORY)
      .useValue(mockPlanetRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // 기본 mock 값 재설정
    mockGalaxyRepository.findAll.mockResolvedValue([testGalaxy]);
    mockPlanetRepository.countByGalaxyId.mockResolvedValue(3);
  });

  describe('GET /api/galaxies', () => {
    it('Galaxy 목록을 반환해야 한다', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/galaxies')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        id: 'galaxy-1',
        name: '프론트엔드',
        description: '프론트엔드 관련 게시판',
        planetCount: 3,
      });
      expect(response.body.data[0].position).toEqual({
        x: 10,
        y: 20,
        z: 30,
      });
    });
  });

  describe('GET /api/galaxies/:id', () => {
    it('존재하는 Galaxy의 상세 정보를 반환해야 한다', async () => {
      mockGalaxyRepository.findById.mockResolvedValue(testGalaxy);

      const response = await request(app.getHttpServer())
        .get('/api/galaxies/galaxy-1')
        .expect(200);

      expect(response.body).toMatchObject({
        id: 'galaxy-1',
        name: '프론트엔드',
        planetCount: 3,
      });
    });

    it('존재하지 않는 Galaxy ID로 요청하면 404를 반환해야 한다', async () => {
      mockGalaxyRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/api/galaxies/nonexistent')
        .expect(404);
    });
  });

  describe('POST /api/galaxies', () => {
    it('새 Galaxy를 생성하고 201을 반환해야 한다', async () => {
      // given: 중복 이름 없음
      mockGalaxyRepository.findAll.mockResolvedValue([]);
      mockGalaxyRepository.create.mockImplementation((entity: GalaxyEntity) =>
        Promise.resolve(entity),
      );

      const response = await request(app.getHttpServer())
        .post('/api/galaxies')
        .send({ name: '새 은하', description: '새 은하 설명' })
        .expect(201);

      // 응답 검증
      expect(response.body).toMatchObject({
        name: '새 은하',
        description: '새 은하 설명',
        planetCount: 0,
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.position).toBeDefined();
    });

    it('중복된 이름으로 생성 시 409를 반환해야 한다', async () => {
      // given: 동일 이름의 Galaxy가 이미 존재
      mockGalaxyRepository.findAll.mockResolvedValue([testGalaxy]);

      await request(app.getHttpServer())
        .post('/api/galaxies')
        .send({ name: '프론트엔드', description: '중복 테스트' })
        .expect(409);
    });
  });
});
