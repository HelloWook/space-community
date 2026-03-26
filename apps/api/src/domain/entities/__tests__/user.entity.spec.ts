// User 도메인 엔티티 단위 테스트

import { UserEntity } from '../user.entity';

describe('UserEntity', () => {
  const validProps = {
    id: 'test-id',
    clerkId: 'user_abc123',
    email: 'test@example.com',
    name: '테스트 사용자',
    imageUrl: 'https://example.com/photo.jpg',
    providers: ['oauth_google'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('유효한 속성으로 엔티티를 생성한다', () => {
    const user = UserEntity.create(validProps);

    expect(user.id).toBe(validProps.id);
    expect(user.clerkId).toBe(validProps.clerkId);
    expect(user.email).toBe(validProps.email);
    expect(user.name).toBe(validProps.name);
    expect(user.imageUrl).toBe(validProps.imageUrl);
    expect(user.providers).toEqual(['oauth_google']);
  });

  it('clerkId가 비어있으면 에러를 던진다', () => {
    expect(() => UserEntity.create({ ...validProps, clerkId: '' })).toThrow();
  });

  it('email이 비어있으면 에러를 던진다', () => {
    expect(() => UserEntity.create({ ...validProps, email: '' })).toThrow();
  });

  it('name과 imageUrl이 null이어도 생성 가능하다', () => {
    const user = UserEntity.create({
      ...validProps,
      name: null,
      imageUrl: null,
    });

    expect(user.name).toBeNull();
    expect(user.imageUrl).toBeNull();
  });

  it('providers가 빈 배열이어도 생성 가능하다', () => {
    const user = UserEntity.create({ ...validProps, providers: [] });

    expect(user.providers).toEqual([]);
  });
});
