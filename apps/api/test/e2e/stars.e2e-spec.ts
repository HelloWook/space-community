// Star API e2e 테스트

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { StarModule } from '../../src/star.module';
import { STAR_REPOSITORY } from '../../src/domain/ports/star-repository.port';
import { StarEntity } from '../../src/domain/entities/star.entity';
import { HttpExceptionFilter } from '../../src/infrastructure/api/filters/http-exception.filter';

describe('Stars API (e2e)', () => {
  let app: INestApplication;

  // Mock 리포지토리
  const mockStarRepository = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StarModule],
    })
      .overrideProvider(STAR_REPOSITORY)
      .useValue(mockStarRepository)
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

  describe('POST /api/planets/:planetId/stars', () => {
    it('Star를 생성하고 201과 star 데이터를 반환해야 한다', async () => {
      // mock: 리포지토리가 생성된 Star와 newStarCount 반환
      mockStarRepository.create.mockImplementation(
        async (star: StarEntity) => ({
          star,
          newStarCount: 6,
        }),
      );

      const response = await request(app.getHttpServer())
        .post('/api/planets/planet-1/stars')
        .send({ giverNickname: '테스트유저' })
        .expect(201);

      // 응답 검증
      expect(response.body.giverNickname).toBe('테스트유저');
      expect(response.body.planetId).toBe('planet-1');
      expect(response.body.newStarCount).toBe(6);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(mockStarRepository.create).toHaveBeenCalledTimes(1);
    });

    it('유효하지 않은 planetId로 요청하면 404를 반환해야 한다', async () => {
      // mock: Planet을 찾을 수 없는 에러
      const notFoundError = new Error('No Planet found');
      notFoundError.name = 'NotFoundError';
      mockStarRepository.create.mockRejectedValue(notFoundError);

      const response = await request(app.getHttpServer())
        .post('/api/planets/nonexistent/stars')
        .send({ giverNickname: '테스트유저' })
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });

    it('별 상한(100)에 도달하면 422를 반환해야 한다', async () => {
      // mock: 별 상한 초과 에러
      mockStarRepository.create.mockRejectedValue(
        new Error('별 개수가 최대치(100)에 도달했습니다'),
      );

      const response = await request(app.getHttpServer())
        .post('/api/planets/planet-full/stars')
        .send({ giverNickname: '테스트유저' })
        .expect(422);

      expect(response.body.statusCode).toBe(422);
    });

    it('유효하지 않은 본문으로 요청하면 400을 반환해야 한다', async () => {
      // giverNickname 누락
      const response = await request(app.getHttpServer())
        .post('/api/planets/planet-1/stars')
        .send({})
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });
  });
});
