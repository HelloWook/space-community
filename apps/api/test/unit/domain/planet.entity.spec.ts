import { PlanetEntity } from '../../../src/domain/entities/planet.entity';

describe('PlanetEntity', () => {
  const validProps = {
    id: 'planet-1',
    title: 'React 18 새 기능 소개',
    content: '# React 18\n\n새로운 기능을 소개합니다.',
    authorNickname: '개발자김',
    starCount: 5,
    position: { x: 1.0, y: 2.0, z: 3.0 },
    galaxyId: 'galaxy-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  describe('create 정적 팩토리 메서드', () => {
    it('유효한 데이터로 Planet 엔티티를 생성해야 한다', () => {
      const planet = PlanetEntity.create(validProps);

      expect(planet.id).toBe(validProps.id);
      expect(planet.title).toBe(validProps.title);
      expect(planet.content).toBe(validProps.content);
      expect(planet.authorNickname).toBe(validProps.authorNickname);
      expect(planet.starCount).toBe(validProps.starCount);
      expect(planet.position).toEqual(validProps.position);
      expect(planet.galaxyId).toBe(validProps.galaxyId);
    });
  });

  describe('title 유효성 검사', () => {
    it('title이 빈 문자열이면 에러를 던져야 한다', () => {
      expect(() =>
        PlanetEntity.create({ ...validProps, title: '' }),
      ).toThrow('title은 1~100자여야 합니다');
    });

    it('title이 100자를 초과하면 에러를 던져야 한다', () => {
      expect(() =>
        PlanetEntity.create({ ...validProps, title: 'a'.repeat(101) }),
      ).toThrow('title은 1~100자여야 합니다');
    });

    it('title이 100자이면 정상 생성되어야 한다', () => {
      const planet = PlanetEntity.create({
        ...validProps,
        title: 'a'.repeat(100),
      });
      expect(planet.title).toHaveLength(100);
    });
  });

  describe('content 유효성 검사', () => {
    it('content가 빈 문자열이면 에러를 던져야 한다', () => {
      expect(() =>
        PlanetEntity.create({ ...validProps, content: '' }),
      ).toThrow('content는 1~10000자여야 합니다');
    });

    it('content가 10000자를 초과하면 에러를 던져야 한다', () => {
      expect(() =>
        PlanetEntity.create({
          ...validProps,
          content: 'a'.repeat(10001),
        }),
      ).toThrow('content는 1~10000자여야 합니다');
    });

    it('content가 10000자이면 정상 생성되어야 한다', () => {
      const planet = PlanetEntity.create({
        ...validProps,
        content: 'a'.repeat(10000),
      });
      expect(planet.content).toHaveLength(10000);
    });
  });

  describe('authorNickname 유효성 검사', () => {
    it('authorNickname이 빈 문자열이면 에러를 던져야 한다', () => {
      expect(() =>
        PlanetEntity.create({ ...validProps, authorNickname: '' }),
      ).toThrow('authorNickname은 1~20자여야 합니다');
    });

    it('authorNickname이 20자를 초과하면 에러를 던져야 한다', () => {
      expect(() =>
        PlanetEntity.create({
          ...validProps,
          authorNickname: 'a'.repeat(21),
        }),
      ).toThrow('authorNickname은 1~20자여야 합니다');
    });

    it('authorNickname이 20자이면 정상 생성되어야 한다', () => {
      const planet = PlanetEntity.create({
        ...validProps,
        authorNickname: 'a'.repeat(20),
      });
      expect(planet.authorNickname).toHaveLength(20);
    });
  });

  describe('starCount 유효성 검사', () => {
    it('starCount가 0 미만이면 에러를 던져야 한다', () => {
      expect(() =>
        PlanetEntity.create({ ...validProps, starCount: -1 }),
      ).toThrow('starCount는 0~100 사이여야 합니다');
    });

    it('starCount가 100을 초과하면 에러를 던져야 한다', () => {
      expect(() =>
        PlanetEntity.create({ ...validProps, starCount: 101 }),
      ).toThrow('starCount는 0~100 사이여야 합니다');
    });

    it('starCount가 0이면 정상 생성되어야 한다', () => {
      const planet = PlanetEntity.create({ ...validProps, starCount: 0 });
      expect(planet.starCount).toBe(0);
    });

    it('starCount가 100이면 정상 생성되어야 한다', () => {
      const planet = PlanetEntity.create({
        ...validProps,
        starCount: 100,
      });
      expect(planet.starCount).toBe(100);
    });
  });
});
