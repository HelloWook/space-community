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

  describe('POST /api/galaxies/:galaxyId/planets', () => {
    it('Planet을 생성하고 201을 반환해야 한다', async () => {
      // mock: repository.create가 전달받은 엔티티를 그대로 반환
      mockPlanetRepository.create.mockImplementation(
        async (planet: PlanetEntity) => planet,
      );

      const response = await request(app.getHttpServer())
        .post('/api/galaxies/galaxy-1/planets')
        .send({
          title: '새 게시글',
          content: '게시글 내용입니다',
          authorNickname: '작성자',
        })
        .expect(201);

      // 응답 검증
      expect(response.body.title).toBe('새 게시글');
      expect(response.body.content).toBe('게시글 내용입니다');
      expect(response.body.authorNickname).toBe('작성자');
      expect(response.body.galaxyId).toBe('galaxy-1');
      expect(response.body.id).toBeDefined();
      expect(response.body.position).toBeDefined();
      expect(mockPlanetRepository.create).toHaveBeenCalledTimes(1);
    });

    it('유효하지 않은 본문으로 요청하면 400을 반환해야 한다', async () => {
      // title 누락
      const response = await request(app.getHttpServer())
        .post('/api/galaxies/galaxy-1/planets')
        .send({
          content: '내용만 있음',
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });
  });

  describe('GET /api/planets/:id', () => {
    it('Planet 상세 정보를 content와 함께 반환해야 한다', async () => {
      const planet = createTestPlanet('p1', '상세 조회 글');
      mockPlanetRepository.findById.mockResolvedValue(planet);

      const response = await request(app.getHttpServer())
        .get('/api/planets/p1')
        .expect(200);

      expect(response.body.id).toBe('p1');
      expect(response.body.title).toBe('상세 조회 글');
      expect(response.body.content).toBe('상세 조회 글 내용');
      expect(response.body.authorNickname).toBe('작성자');
      expect(response.body.galaxyId).toBe('galaxy-1');
    });

    it('존재하지 않는 ID로 조회하면 404를 반환해야 한다', async () => {
      mockPlanetRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/api/planets/nonexistent')
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });
  });
});
