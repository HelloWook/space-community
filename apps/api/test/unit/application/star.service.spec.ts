// StarService 단위 테스트

import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StarService } from '../../../src/application/services/star.service';
import { STAR_REPOSITORY } from '../../../src/domain/ports/star-repository.port';
import { StarEntity } from '../../../src/domain/entities/star.entity';
import { CreateStarDto } from '../../../src/application/dto/star.dto';

describe('StarService', () => {
  let service: StarService;

  // Mock 리포지토리 정의
  const mockStarRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarService,
        {
          provide: STAR_REPOSITORY,
          useValue: mockStarRepository,
        },
      ],
    }).compile();

    service = module.get<StarService>(StarService);

    // 각 테스트 전 mock 초기화
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Star를 생성하고 newStarCount를 포함한 응답을 반환해야 한다', async () => {
      // given: 유효한 생성 요청
      const dto: CreateStarDto = { giverNickname: '테스트유저' };
      const planetId = 'planet-1';

      // mock: 리포지토리가 Star와 newStarCount를 반환
      mockStarRepository.create.mockImplementation(
        async (star: StarEntity) => ({
          star,
          newStarCount: 6,
        }),
      );

      // when: create 호출
      const result = await service.create(planetId, dto);

      // then: 응답 검증
      expect(result.giverNickname).toBe('테스트유저');
      expect(result.planetId).toBe('planet-1');
      expect(result.newStarCount).toBe(6);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(mockStarRepository.create).toHaveBeenCalledTimes(1);

      // 리포지토리에 올바른 인자가 전달되었는지 검증
      const calledStar = mockStarRepository.create.mock.calls[0][0];
      expect(calledStar).toBeInstanceOf(StarEntity);
      expect(calledStar.giverNickname).toBe('테스트유저');
      expect(calledStar.planetId).toBe('planet-1');

      // maxStarCount가 100으로 전달되었는지 검증
      const calledMax = mockStarRepository.create.mock.calls[0][1];
      expect(calledMax).toBe(100);
    });

    it('starCount가 100 이상이면 UnprocessableEntityException(422)을 던져야 한다', async () => {
      // given: 별 상한 초과 에러를 반환하는 리포지토리
      const dto: CreateStarDto = { giverNickname: '테스트유저' };
      const planetId = 'planet-full';

      mockStarRepository.create.mockRejectedValue(
        new Error('별 개수가 최대치(100)에 도달했습니다'),
      );

      // when & then: UnprocessableEntityException 발생 검증
      await expect(service.create(planetId, dto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('유효하지 않은 planetId이면 NotFoundException을 던져야 한다', async () => {
      // given: Planet을 찾을 수 없는 에러를 반환하는 리포지토리
      const dto: CreateStarDto = { giverNickname: '테스트유저' };
      const planetId = 'nonexistent';

      // Prisma findUniqueOrThrow 에러 시뮬레이션
      const notFoundError = new Error('No Planet found');
      notFoundError.name = 'NotFoundError';
      mockStarRepository.create.mockRejectedValue(notFoundError);

      // when & then: NotFoundException 발생 검증
      await expect(service.create(planetId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
