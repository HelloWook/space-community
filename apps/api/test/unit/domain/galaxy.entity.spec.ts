import { GalaxyEntity } from '../../../src/domain/entities/galaxy.entity';

describe('GalaxyEntity', () => {
  const validProps = {
    id: 'galaxy-1',
    name: '프론트엔드',
    description: '프론트엔드 관련 게시판입니다',
    position: { x: 1.0, y: 2.0, z: 3.0 },
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  describe('create 정적 팩토리 메서드', () => {
    it('유효한 데이터로 Galaxy 엔티티를 생성해야 한다', () => {
      const galaxy = GalaxyEntity.create(validProps);

      expect(galaxy.id).toBe(validProps.id);
      expect(galaxy.name).toBe(validProps.name);
      expect(galaxy.description).toBe(validProps.description);
      expect(galaxy.position).toEqual(validProps.position);
      expect(galaxy.createdAt).toEqual(validProps.createdAt);
      expect(galaxy.updatedAt).toEqual(validProps.updatedAt);
    });
  });

  describe('name 유효성 검사', () => {
    it('name이 빈 문자열이면 에러를 던져야 한다', () => {
      expect(() =>
        GalaxyEntity.create({ ...validProps, name: '' }),
      ).toThrow('name은 1~50자여야 합니다');
    });

    it('name이 50자를 초과하면 에러를 던져야 한다', () => {
      expect(() =>
        GalaxyEntity.create({ ...validProps, name: 'a'.repeat(51) }),
      ).toThrow('name은 1~50자여야 합니다');
    });

    it('name이 50자이면 정상 생성되어야 한다', () => {
      const galaxy = GalaxyEntity.create({
        ...validProps,
        name: 'a'.repeat(50),
      });
      expect(galaxy.name).toHaveLength(50);
    });

    it('name이 1자이면 정상 생성되어야 한다', () => {
      const galaxy = GalaxyEntity.create({ ...validProps, name: 'a' });
      expect(galaxy.name).toHaveLength(1);
    });
  });

  describe('description 유효성 검사', () => {
    it('description이 빈 문자열이면 에러를 던져야 한다', () => {
      expect(() =>
        GalaxyEntity.create({ ...validProps, description: '' }),
      ).toThrow('description은 1~200자여야 합니다');
    });

    it('description이 200자를 초과하면 에러를 던져야 한다', () => {
      expect(() =>
        GalaxyEntity.create({
          ...validProps,
          description: 'a'.repeat(201),
        }),
      ).toThrow('description은 1~200자여야 합니다');
    });

    it('description이 200자이면 정상 생성되어야 한다', () => {
      const galaxy = GalaxyEntity.create({
        ...validProps,
        description: 'a'.repeat(200),
      });
      expect(galaxy.description).toHaveLength(200);
    });
  });
});
