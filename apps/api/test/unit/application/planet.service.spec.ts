// PlanetService 단위 테스트

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PlanetService } from '../../../src/application/services/planet.service';
import { PLANET_REPOSITORY } from '../../../src/domain/ports/planet-repository.port';
import { PlanetEntity } from '../../../src/domain/entities/planet.entity';
import { CreatePlanetDto } from '../../../src/application/dto/planet.dto';
import { UserService } from '../../../src/application/services/user.service';
import { UserEntity } from '../../../src/domain/entities/user.entity';

describe('PlanetService', () => {
  let service: PlanetService;

  // Mock 리포지토리 정의
  const mockPlanetRepository = {
    findByGalaxyId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    countByGalaxyId: jest.fn(),
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
        PlanetService,
        {
          provide: PLANET_REPOSITORY,
          useValue: mockPlanetRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<PlanetService>(PlanetService);

    // 각 테스트 전 mock 초기화
    jest.clearAllMocks();
    mockUserService.findOrCreateByClerkId.mockResolvedValue(testUser);
  });

  // 테스트용 Planet 엔티티 생성 헬퍼
  const createPlanet = (id: string, title: string, appearance?: Partial<{
    mainColor: string; subColor: string; size: string; shape: string; pattern: string; hasRing: boolean;
  }>): PlanetEntity => {
    return PlanetEntity.create({
      id,
      title,
      content: `${title} 내용`,
      authorNickname: '테스트유저',
      starCount: 5,
      position: { x: 1, y: 2, z: 3 },
      galaxyId: 'g1',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      ...appearance,
    });
  };

  describe('findByGalaxy', () => {
    it('커서 기반 페이지네이션으로 Planet 목록을 반환해야 한다', async () => {
      const planets = [
        createPlanet('p1', '첫번째 게시글'),
        createPlanet('p2', '두번째 게시글'),
      ];
      mockPlanetRepository.findByGalaxyId.mockResolvedValue({
        planets,
        nextCursor: 'p2',
        hasMore: true,
      });

      const result = await service.findByGalaxy('g1', null, 2);

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({
        id: 'p1',
        title: '첫번째 게시글',
        authorNickname: '테스트유저',
        authorName: null,
        starCount: 5,
        commentCount: 0,
        position: { x: 1, y: 2, z: 3 },
        mainColor: '#4A90D9',
        subColor: '#2C5F8A',
        size: 'MEDIUM',
        shape: 'SPHERE',
        pattern: 'SMOOTH',
        hasRing: false,
        createdAt: new Date('2026-01-01'),
      });
      expect(result.data[0]).not.toHaveProperty('content');
      expect(result.nextCursor).toBe('p2');
      expect(result.hasMore).toBe(true);
    });
  });

  describe('create', () => {
    it('clerkId로 User를 조회하고 authorNickname에 User.name을 자동 설정해야 한다', async () => {
      const dto: CreatePlanetDto = {
        title: '새로운 게시글',
        content: '게시글 내용입니다',
      };
      const galaxyId = 'g1';
      const clerkId = 'clerk_test';

      mockPlanetRepository.create.mockImplementation(
        async (planet: PlanetEntity) => planet,
      );

      const result = await service.create(galaxyId, dto, clerkId);

      expect(result.title).toBe('새로운 게시글');
      expect(result.content).toBe('게시글 내용입니다');
      expect(result.authorNickname).toBe('테스트유저');
      expect(result.authorName).toBe('테스트유저');
      expect(result.galaxyId).toBe('g1');
      expect(result.starCount).toBe(0);
      expect(mockUserService.findOrCreateByClerkId).toHaveBeenCalledWith('clerk_test');
    });

    it('외형 속성이 포함된 DTO로 Planet을 생성해야 한다', async () => {
      const dto = {
        title: '커스텀 행성',
        content: '커스텀 내용',
        mainColor: '#FF6B35',
        subColor: '#004E64',
        size: 'LARGE',
        shape: 'DODECAHEDRON',
        pattern: 'CRATER',
        hasRing: true,
      };

      mockPlanetRepository.create.mockImplementation(
        async (planet: PlanetEntity) => planet,
      );

      const result = await service.create('g1', dto as any, 'clerk_test');

      expect(result.mainColor).toBe('#FF6B35');
      expect(result.subColor).toBe('#004E64');
      expect(result.size).toBe('LARGE');
      expect(result.shape).toBe('DODECAHEDRON');
      expect(result.pattern).toBe('CRATER');
      expect(result.hasRing).toBe(true);
    });
  });

  describe('findById', () => {
    it('ID로 Planet 상세 정보를 반환해야 한다', async () => {
      const planet = createPlanet('p1', '테스트 게시글');
      mockPlanetRepository.findById.mockResolvedValue(planet);

      const result = await service.findById('p1');

      expect(result.id).toBe('p1');
      expect(result.title).toBe('테스트 게시글');
      expect(result.content).toBe('테스트 게시글 내용');
      expect(result.authorNickname).toBe('테스트유저');
      expect(result.authorName).toBeNull();
    });

    it('존재하지 않는 Planet ID로 조회하면 NotFoundException을 던져야 한다', async () => {
      mockPlanetRepository.findById.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
