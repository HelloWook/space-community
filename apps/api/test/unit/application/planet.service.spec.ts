// PlanetService 단위 테스트

import { Test, TestingModule } from '@nestjs/testing';
import { PlanetService } from '../../../src/application/services/planet.service';
import { PLANET_REPOSITORY } from '../../../src/domain/ports/planet-repository.port';
import { PlanetEntity } from '../../../src/domain/entities/planet.entity';

describe('PlanetService', () => {
  let service: PlanetService;

  // Mock 리포지토리 정의
  const mockPlanetRepository = {
    findByGalaxyId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    countByGalaxyId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetService,
        {
          provide: PLANET_REPOSITORY,
          useValue: mockPlanetRepository,
        },
      ],
    }).compile();

    service = module.get<PlanetService>(PlanetService);

    // 각 테스트 전 mock 초기화
    jest.clearAllMocks();
  });

  // 테스트용 Planet 엔티티 생성 헬퍼
  const createPlanet = (id: string, title: string): PlanetEntity => {
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
    });
  };

  describe('findByGalaxy', () => {
    it('커서 기반 페이지네이션으로 Planet 목록을 반환해야 한다', async () => {
      // given: 2개의 Planet과 다음 페이지 존재
      const planets = [
        createPlanet('p1', '첫번째 게시글'),
        createPlanet('p2', '두번째 게시글'),
      ];
      mockPlanetRepository.findByGalaxyId.mockResolvedValue({
        planets,
        nextCursor: 'p2',
        hasMore: true,
      });

      // when: findByGalaxy 호출
      const result = await service.findByGalaxy('g1', null, 2);

      // then: 올바른 페이지네이션 응답 형식 검증
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({
        id: 'p1',
        title: '첫번째 게시글',
        authorNickname: '테스트유저',
        starCount: 5,
        position: { x: 1, y: 2, z: 3 },
        createdAt: new Date('2026-01-01'),
      });
      // content가 포함되지 않아야 한다 (PlanetSummaryDto)
      expect(result.data[0]).not.toHaveProperty('content');
      expect(result.nextCursor).toBe('p2');
      expect(result.hasMore).toBe(true);
      expect(mockPlanetRepository.findByGalaxyId).toHaveBeenCalledWith(
        'g1',
        null,
        2,
      );
    });

    it('커서를 전달하면 다음 페이지를 조회해야 한다', async () => {
      // given: 마지막 페이지
      const planets = [createPlanet('p3', '세번째 게시글')];
      mockPlanetRepository.findByGalaxyId.mockResolvedValue({
        planets,
        nextCursor: null,
        hasMore: false,
      });

      // when: 커서와 함께 호출
      const result = await service.findByGalaxy('g1', 'p2', 2);

      // then: 마지막 페이지 응답 검증
      expect(result.data).toHaveLength(1);
      expect(result.nextCursor).toBeNull();
      expect(result.hasMore).toBe(false);
      expect(mockPlanetRepository.findByGalaxyId).toHaveBeenCalledWith(
        'g1',
        'p2',
        2,
      );
    });

    it('Planet이 없으면 빈 배열을 반환해야 한다', async () => {
      // given
      mockPlanetRepository.findByGalaxyId.mockResolvedValue({
        planets: [],
        nextCursor: null,
        hasMore: false,
      });

      // when
      const result = await service.findByGalaxy('g1', null, 50);

      // then
      expect(result.data).toEqual([]);
      expect(result.hasMore).toBe(false);
    });
  });
});
