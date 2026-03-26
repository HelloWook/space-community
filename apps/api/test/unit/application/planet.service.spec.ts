// PlanetService 단위 테스트

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PlanetService } from '../../../src/application/services/planet.service';
import { PLANET_REPOSITORY } from '../../../src/domain/ports/planet-repository.port';
import { PlanetEntity } from '../../../src/domain/entities/planet.entity';
import { CreatePlanetDto } from '../../../src/application/dto/planet.dto';

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

  describe('create', () => {
    it('자동 생성된 위치와 함께 Planet을 생성하고 PlanetDetailResponseDto를 반환해야 한다', async () => {
      // given: 생성 요청 DTO
      const dto: CreatePlanetDto = {
        title: '새로운 게시글',
        content: '게시글 내용입니다',
        authorNickname: '작성자',
      };
      const galaxyId = 'g1';

      // mock: repository.create가 전달받은 엔티티를 그대로 반환
      mockPlanetRepository.create.mockImplementation(
        async (planet: PlanetEntity) => planet,
      );

      // when: create 호출
      const result = await service.create(galaxyId, dto);

      // then: 반환값 검증
      expect(result.title).toBe('새로운 게시글');
      expect(result.content).toBe('게시글 내용입니다');
      expect(result.authorNickname).toBe('작성자');
      expect(result.galaxyId).toBe('g1');
      expect(result.starCount).toBe(0);
      expect(result.id).toBeDefined();

      // 위치가 [-10, 10] 범위 내에 자동 생성되어야 한다
      expect(result.position.x).toBeGreaterThanOrEqual(-10);
      expect(result.position.x).toBeLessThanOrEqual(10);
      expect(result.position.y).toBeGreaterThanOrEqual(-10);
      expect(result.position.y).toBeLessThanOrEqual(10);
      expect(result.position.z).toBeGreaterThanOrEqual(-10);
      expect(result.position.z).toBeLessThanOrEqual(10);

      // repository.create가 올바르게 호출되었는지 검증
      expect(mockPlanetRepository.create).toHaveBeenCalledTimes(1);
      const createdEntity = mockPlanetRepository.create.mock.calls[0][0];
      expect(createdEntity).toBeInstanceOf(PlanetEntity);
      expect(createdEntity.title).toBe('새로운 게시글');
      expect(createdEntity.galaxyId).toBe('g1');
    });
  });

  describe('findById', () => {
    it('ID로 Planet 상세 정보를 반환해야 한다', async () => {
      // given: 존재하는 Planet
      const planet = createPlanet('p1', '테스트 게시글');
      mockPlanetRepository.findById.mockResolvedValue(planet);

      // when: findById 호출
      const result = await service.findById('p1');

      // then: PlanetDetailResponseDto 형식 검증 (content 포함)
      expect(result.id).toBe('p1');
      expect(result.title).toBe('테스트 게시글');
      expect(result.content).toBe('테스트 게시글 내용');
      expect(result.authorNickname).toBe('테스트유저');
      expect(result.starCount).toBe(5);
      expect(result.position).toEqual({ x: 1, y: 2, z: 3 });
      expect(result.galaxyId).toBe('g1');
      expect(result.createdAt).toEqual(new Date('2026-01-01'));
      expect(mockPlanetRepository.findById).toHaveBeenCalledWith('p1');
    });

    it('존재하지 않는 Planet ID로 조회하면 NotFoundException을 던져야 한다', async () => {
      // given: 존재하지 않는 ID
      mockPlanetRepository.findById.mockResolvedValue(null);

      // when & then: NotFoundException 발생 검증
      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPlanetRepository.findById).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('외형 속성 처리', () => {
    it('외형 속성이 포함된 DTO로 Planet을 생성해야 한다', async () => {
      const dto = {
        title: '커스텀 행성',
        content: '커스텀 내용',
        authorNickname: '작성자',
        mainColor: '#FF6B35',
        subColor: '#004E64',
        size: 'LARGE',
        shape: 'DODECAHEDRON',
        pattern: 'CRATER',
        hasRing: true,
      };
      const galaxyId = 'g1';

      mockPlanetRepository.create.mockImplementation(
        async (planet: PlanetEntity) => planet,
      );

      const result = await service.create(galaxyId, dto as any);

      expect(result.mainColor).toBe('#FF6B35');
      expect(result.subColor).toBe('#004E64');
      expect(result.size).toBe('LARGE');
      expect(result.shape).toBe('DODECAHEDRON');
      expect(result.pattern).toBe('CRATER');
      expect(result.hasRing).toBe(true);
    });

    it('외형 속성 미지정 시 기본값으로 생성해야 한다', async () => {
      const dto: CreatePlanetDto = {
        title: '기본 행성',
        content: '기본 내용',
        authorNickname: '작성자',
      };

      mockPlanetRepository.create.mockImplementation(
        async (planet: PlanetEntity) => planet,
      );

      const result = await service.create('g1', dto);

      expect(result.mainColor).toBe('#4A90D9');
      expect(result.subColor).toBe('#2C5F8A');
      expect(result.size).toBe('MEDIUM');
      expect(result.shape).toBe('SPHERE');
      expect(result.pattern).toBe('SMOOTH');
      expect(result.hasRing).toBe(false);
    });

    it('findByGalaxy 응답에 외형 속성이 포함되어야 한다', async () => {
      const planets = [
        createPlanet('p1', '커스텀', {
          mainColor: '#FF0000',
          subColor: '#00FF00',
          size: 'SMALL',
          shape: 'TORUS',
          pattern: 'STRIPE',
          hasRing: true,
        }),
      ];
      mockPlanetRepository.findByGalaxyId.mockResolvedValue({
        planets,
        nextCursor: null,
        hasMore: false,
      });

      const result = await service.findByGalaxy('g1', null, 50);

      expect(result.data[0].mainColor).toBe('#FF0000');
      expect(result.data[0].subColor).toBe('#00FF00');
      expect(result.data[0].size).toBe('SMALL');
      expect(result.data[0].shape).toBe('TORUS');
      expect(result.data[0].pattern).toBe('STRIPE');
      expect(result.data[0].hasRing).toBe(true);
    });

    it('findById 응답에 외형 속성이 포함되어야 한다', async () => {
      const planet = createPlanet('p1', '커스텀', {
        mainColor: '#AABBCC',
        shape: 'CONE',
        hasRing: false,
      });
      mockPlanetRepository.findById.mockResolvedValue(planet);

      const result = await service.findById('p1');

      expect(result.mainColor).toBe('#AABBCC');
      expect(result.shape).toBe('CONE');
      expect(result.hasRing).toBe(false);
    });
  });
});
