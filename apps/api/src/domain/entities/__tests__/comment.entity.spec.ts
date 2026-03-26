// Comment 도메인 엔티티 단위 테스트

import { CommentEntity } from '../comment.entity';

describe('CommentEntity', () => {
  const validProps = {
    id: 'test-comment-id',
    content: '테스트 댓글입니다',
    authorNickname: '테스터',
    planetId: 'planet-id-1',
    parentId: null,
    createdAt: new Date(),
  };

  it('유효한 속성으로 엔티티를 생성한다', () => {
    const comment = CommentEntity.create(validProps);

    expect(comment.id).toBe(validProps.id);
    expect(comment.content).toBe(validProps.content);
    expect(comment.authorNickname).toBe(validProps.authorNickname);
    expect(comment.planetId).toBe(validProps.planetId);
    expect(comment.parentId).toBeNull();
    expect(comment.createdAt).toBe(validProps.createdAt);
  });

  it('content가 비어있으면 에러를 던진다', () => {
    expect(() =>
      CommentEntity.create({ ...validProps, content: '' }),
    ).toThrow('content는 1~500자여야 합니다');
  });

  it('content가 500자를 초과하면 에러를 던진다', () => {
    expect(() =>
      CommentEntity.create({ ...validProps, content: 'a'.repeat(501) }),
    ).toThrow('content는 1~500자여야 합니다');
  });

  it('authorNickname이 비어있으면 에러를 던진다', () => {
    expect(() =>
      CommentEntity.create({ ...validProps, authorNickname: '' }),
    ).toThrow('authorNickname은 1~20자여야 합니다');
  });

  it('authorNickname이 20자를 초과하면 에러를 던진다', () => {
    expect(() =>
      CommentEntity.create({ ...validProps, authorNickname: 'a'.repeat(21) }),
    ).toThrow('authorNickname은 1~20자여야 합니다');
  });

  it('parentId가 null이어도 생성 가능하다', () => {
    const comment = CommentEntity.create({ ...validProps, parentId: null });

    expect(comment.parentId).toBeNull();
  });

  it('parentId가 있으면 답글로 생성된다', () => {
    const comment = CommentEntity.create({
      ...validProps,
      parentId: 'parent-comment-id',
    });

    expect(comment.parentId).toBe('parent-comment-id');
  });
});
