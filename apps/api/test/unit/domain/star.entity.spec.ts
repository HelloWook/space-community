import { StarEntity } from '../../../src/domain/entities/star.entity';

describe('StarEntity', () => {
  const validProps = {
    id: 'star-1',
    giverNickname: '칭찬봇',
    planetId: 'planet-1',
    createdAt: new Date('2026-01-01'),
  };

  describe('create 정적 팩토리 메서드', () => {
    it('유효한 데이터로 Star 엔티티를 생성해야 한다', () => {
      const star = StarEntity.create(validProps);

      expect(star.id).toBe(validProps.id);
      expect(star.giverNickname).toBe(validProps.giverNickname);
      expect(star.planetId).toBe(validProps.planetId);
      expect(star.createdAt).toEqual(validProps.createdAt);
    });
  });

  describe('giverNickname 유효성 검사', () => {
    it('giverNickname이 빈 문자열이면 에러를 던져야 한다', () => {
      expect(() =>
        StarEntity.create({ ...validProps, giverNickname: '' }),
      ).toThrow('giverNickname은 1~20자여야 합니다');
    });

    it('giverNickname이 20자를 초과하면 에러를 던져야 한다', () => {
      expect(() =>
        StarEntity.create({
          ...validProps,
          giverNickname: 'a'.repeat(21),
        }),
      ).toThrow('giverNickname은 1~20자여야 합니다');
    });

    it('giverNickname이 20자이면 정상 생성되어야 한다', () => {
      const star = StarEntity.create({
        ...validProps,
        giverNickname: 'a'.repeat(20),
      });
      expect(star.giverNickname).toHaveLength(20);
    });

    it('giverNickname이 1자이면 정상 생성되어야 한다', () => {
      const star = StarEntity.create({
        ...validProps,
        giverNickname: 'a',
      });
      expect(star.giverNickname).toHaveLength(1);
    });
  });
});
