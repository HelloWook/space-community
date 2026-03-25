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
});
