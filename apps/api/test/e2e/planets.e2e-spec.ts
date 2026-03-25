// Planet API e2e 테스트

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PlanetModule } from '../../src/planet.module';
import { PLANET_REPOSITORY } from '../../src/domain/ports/planet-repository.port';
import { PlanetEntity } from '../../src/domain/entities/planet.entity';
import { HttpExceptionFilter } from '../../src/infrastructure/api/filters/http-exception.filter';

describe('Planets API (e2e)', () => {
  let app: INestApplication;

  // 테스트용 Planet 데이터
  const createTestPlanet = (id: string, title: string): PlanetEntity => {
    return PlanetEntity.create({
      id,
      title,
      content: `${title} 내용`,
      authorNickname: '작성자',
      starCount: 5,
      position: { x: 1, y: 2, z: 3 },
      galaxyId: 'galaxy-1',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    });
  };

  // Mock 리포지토리
  const mockPlanetRepository = {
    findByGalaxyId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    countByGalaxyId: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PlanetModule],
    })
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
  });

  describe('GET /api/galaxies/:galaxyId/planets', () => {
    it('페이지네이션된 Planet 목록을 반환해야 한다', async () => {
      const planets = [
        createTestPlanet('p1', '첫번째 글'),
        createTestPlanet('p2', '두번째 글'),
      ];
      mockPlanetRepository.findByGalaxyId.mockResolvedValue({
        planets,
        nextCursor: 'p2',
        hasMore: true,
      });

      const response = await request(app.getHttpServer())
        .get('/api/galaxies/galaxy-1/planets')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toMatchObject({
        id: 'p1',
        title: '첫번째 글',
        authorNickname: '작성자',
        starCount: 5,
      });
      // content는 요약 DTO이므로 포함되지 않아야 한다
      expect(response.body.data[0]).not.toHaveProperty('content');
      expect(response.body.nextCursor).toBe('p2');
      expect(response.body.hasMore).toBe(true);
    });

    it('커서를 전달하면 다음 페이지를 조회해야 한다', async () => {
      const planets = [createTestPlanet('p3', '세번째 글')];
      mockPlanetRepository.findByGalaxyId.mockResolvedValue({
        planets,
        nextCursor: null,
        hasMore: false,
      });

      const response = await request(app.getHttpServer())
        .get('/api/galaxies/galaxy-1/planets?cursor=p2&limit=2')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.nextCursor).toBeNull();
      expect(response.body.hasMore).toBe(false);
      expect(mockPlanetRepository.findByGalaxyId).toHaveBeenCalledWith(
        'galaxy-1',
        'p2',
        2,
      );
    });
  });
});
