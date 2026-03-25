// GalaxyService 단위 테스트

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GalaxyService } from '../../../src/application/services/galaxy.service';
import { GALAXY_REPOSITORY } from '../../../src/domain/ports/galaxy-repository.port';
import { PLANET_REPOSITORY } from '../../../src/domain/ports/planet-repository.port';
import { GalaxyEntity } from '../../../src/domain/entities/galaxy.entity';

describe('GalaxyService', () => {
  let service: GalaxyService;

  // Mock 리포지토리 정의
  const mockGalaxyRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockPlanetRepository = {
    findByGalaxyId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    countByGalaxyId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalaxyService,
        {
          provide: GALAXY_REPOSITORY,
          useValue: mockGalaxyRepository,
        },
        {
          provide: PLANET_REPOSITORY,
          useValue: mockPlanetRepository,
        },
      ],
    }).compile();

    service = module.get<GalaxyService>(GalaxyService);

    // 각 테스트 전 mock 초기화
    jest.clearAllMocks();
  });

  // 테스트용 Galaxy 엔티티 생성 헬퍼
  const createGalaxy = (id: string, name: string): GalaxyEntity => {
    return GalaxyEntity.create({
      id,
      name,
      description: `${name} 설명`,
      position: { x: 1, y: 2, z: 3 },
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    });
  };

  describe('findAll', () => {
    it('Galaxy 목록을 planetCount와 함께 반환해야 한다', async () => {
      // given: 2개의 Galaxy와 각각의 Planet 개수 설정
      const galaxies = [
        createGalaxy('g1', '프론트엔드'),
        createGalaxy('g2', '백엔드'),
      ];
      mockGalaxyRepository.findAll.mockResolvedValue(galaxies);
      mockPlanetRepository.countByGalaxyId
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(3);

      // when: findAll 호출
      const result = await service.findAll();

      // then: 올바른 응답 형식 검증
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({
        id: 'g1',
        name: '프론트엔드',
        description: '프론트엔드 설명',
        position: { x: 1, y: 2, z: 3 },
        planetCount: 5,
        createdAt: new Date('2026-01-01'),
      });
      expect(result.data[1].planetCount).toBe(3);
      expect(mockPlanetRepository.countByGalaxyId).toHaveBeenCalledTimes(2);
    });

    it('Galaxy가 없으면 빈 배열을 반환해야 한다', async () => {
      // given
      mockGalaxyRepository.findAll.mockResolvedValue([]);

      // when
      const result = await service.findAll();

      // then
      expect(result.data).toEqual([]);
    });
  });

  describe('findById', () => {
    it('존재하는 Galaxy를 반환해야 한다', async () => {
      // given
      const galaxy = createGalaxy('g1', '프론트엔드');
      mockGalaxyRepository.findById.mockResolvedValue(galaxy);
      mockPlanetRepository.countByGalaxyId.mockResolvedValue(10);

      // when
      const result = await service.findById('g1');

      // then
      expect(result.id).toBe('g1');
      expect(result.name).toBe('프론트엔드');
      expect(result.planetCount).toBe(10);
      expect(mockGalaxyRepository.findById).toHaveBeenCalledWith('g1');
    });

    it('존재하지 않는 Galaxy일 경우 NotFoundException을 던져야 한다', async () => {
      // given
      mockGalaxyRepository.findById.mockResolvedValue(null);

      // when & then
      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
