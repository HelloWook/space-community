// StarService 단위 테스트

import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { StarService } from '../../../src/application/services/star.service';
import { STAR_REPOSITORY } from '../../../src/domain/ports/star-repository.port';
import { StarEntity } from '../../../src/domain/entities/star.entity';
import { UserService } from '../../../src/application/services/user.service';
import { UserEntity } from '../../../src/domain/entities/user.entity';

describe('StarService', () => {
  let service: StarService;

  // Mock 리포지토리 정의
  const mockStarRepository = {
    create: jest.fn(),
    findByGiverAndPlanet: jest.fn(),
  };

  // Mock UserService
  const mockUserService = {
    findOrCreateByClerkId: jest.fn(),
  };

  // 테스트용 유저
  const testUser = UserEntity.create({
    id: 'user-1',
    clerkId: 'clerk_test',
    email: 'test@test.com',
    name: '테스트유저',
    imageUrl: null,
    providers: ['oauth_google'],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarService,
        {
          provide: STAR_REPOSITORY,
          useValue: mockStarRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<StarService>(StarService);

    jest.clearAllMocks();
    mockUserService.findOrCreateByClerkId.mockResolvedValue(testUser);
    mockStarRepository.findByGiverAndPlanet.mockResolvedValue(null);
  });

  describe('create', () => {
    it('clerkId로 User를 조회하고 giverNickname에 User.name을 자동 설정해야 한다', async () => {
      const planetId = 'planet-1';
      const clerkId = 'clerk_test';

      mockStarRepository.create.mockImplementation(
        async (star: StarEntity) => ({
          star,
          newStarCount: 6,
        }),
      );

      const result = await service.create(planetId, clerkId);

      expect(result.giverNickname).toBe('테스트유저');
      expect(result.planetId).toBe('planet-1');
      expect(result.newStarCount).toBe(6);
      expect(result.alreadyGiven).toBe(false);
      expect(mockUserService.findOrCreateByClerkId).toHaveBeenCalledWith('clerk_test');
      expect(mockStarRepository.create).toHaveBeenCalledTimes(1);

      // giverId가 리포지토리에 전달되었는지 검증
      const calledGiverId = mockStarRepository.create.mock.calls[0][2];
      expect(calledGiverId).toBe('user-1');
    });

    it('동일 사용자가 같은 행성에 중복 별주기 시 ConflictException(409)을 던져야 한다', async () => {
      const planetId = 'planet-1';
      const clerkId = 'clerk_test';

      // 이미 별을 준 상태
      mockStarRepository.findByGiverAndPlanet.mockResolvedValue(
        StarEntity.create({
          id: 'existing-star',
          giverNickname: '테스트유저',
          planetId: 'planet-1',
          createdAt: new Date(),
        }),
      );

      await expect(service.create(planetId, clerkId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('starCount가 100 이상이면 UnprocessableEntityException(422)을 던져야 한다', async () => {
      const planetId = 'planet-full';
      const clerkId = 'clerk_test';

      mockStarRepository.create.mockRejectedValue(
        new Error('별 개수가 최대치(100)에 도달했습니다'),
      );

      await expect(service.create(planetId, clerkId)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('유효하지 않은 planetId이면 NotFoundException을 던져야 한다', async () => {
      const planetId = 'nonexistent';
      const clerkId = 'clerk_test';

      const notFoundError = new Error('No Planet found');
      notFoundError.name = 'NotFoundError';
      mockStarRepository.create.mockRejectedValue(notFoundError);

      await expect(service.create(planetId, clerkId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
