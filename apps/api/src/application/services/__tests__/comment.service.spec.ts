// CommentService 단위 테스트

import { CommentService } from '../comment.service';
import { ICommentRepository } from '../../../domain/ports/comment-repository.port';
import { CommentEntity } from '../../../domain/entities/comment.entity';
import { UnprocessableEntityException, BadRequestException } from '@nestjs/common';

describe('CommentService', () => {
  let service: CommentService;
  let mockRepository: jest.Mocked<ICommentRepository>;

  const now = new Date();

  const mockComment = CommentEntity.create({
    id: 'comment-1',
    content: '테스트 댓글',
    authorNickname: '테스터',
    planetId: 'planet-1',
    parentId: null,
    createdAt: now,
  });

  const mockReply = CommentEntity.create({
    id: 'reply-1',
    content: '테스트 답글',
    authorNickname: '답글러',
    planetId: 'planet-1',
    parentId: 'comment-1',
    createdAt: now,
  });

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findByPlanetId: jest.fn(),
      findById: jest.fn(),
    };
    service = new CommentService(mockRepository);
  });

  describe('create', () => {
    it('댓글을 정상적으로 생성한다', async () => {
      mockRepository.create.mockResolvedValue({
        comment: mockComment,
        newCommentCount: 1,
      });

      const result = await service.create('planet-1', {
        content: '테스트 댓글',
        authorNickname: '테스터',
      });

      expect(result.id).toBeDefined();
      expect(result.content).toBe('테스트 댓글');
      expect(result.authorNickname).toBe('테스터');
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('답글을 생성할 때 부모가 최상위 댓글이면 성공한다', async () => {
      // 부모 댓글이 최상위 (parentId === null)
      mockRepository.findById.mockResolvedValue(mockComment);
      mockRepository.create.mockResolvedValue({
        comment: mockReply,
        newCommentCount: 2,
      });

      const result = await service.create('planet-1', {
        content: '테스트 답글',
        authorNickname: '답글러',
        parentId: 'comment-1',
      });

      expect(result.parentId).toBe('comment-1');
    });

    it('답글의 답글은 거부한다 (1단계 깊이 제한)', async () => {
      // 부모 댓글이 이미 답글인 경우 (parentId !== null)
      mockRepository.findById.mockResolvedValue(mockReply);

      await expect(
        service.create('planet-1', {
          content: '답글의 답글',
          authorNickname: '테스터',
          parentId: 'reply-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('댓글 최대 개수(50)를 초과하면 에러를 던진다', async () => {
      mockRepository.create.mockRejectedValue(
        new Error('댓글 개수가 최대치(50)에 도달했습니다'),
      );

      await expect(
        service.create('planet-1', {
          content: '초과 댓글',
          authorNickname: '테스터',
        }),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('findByPlanet', () => {
    it('Planet의 댓글 목록을 트리 구조로 반환한다', async () => {
      mockRepository.findByPlanetId.mockResolvedValue([
        mockComment,
        mockReply,
      ]);

      const result = await service.findByPlanet('planet-1');

      expect(result.data).toBeDefined();
      expect(result.totalCount).toBe(2);
    });
  });
});
