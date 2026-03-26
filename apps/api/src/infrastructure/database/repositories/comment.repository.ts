// Comment Prisma 리포지토리 구현체

import { Injectable } from '@nestjs/common';
import {
  ICommentRepository,
  CreateCommentResult,
} from '../../../domain/ports/comment-repository.port';
import { CommentEntity } from '../../../domain/entities/comment.entity';
import { PrismaService } from '../prisma.service';
import { CommentMapper } from '../../../application/mappers';

/** Comment 리포지토리 Prisma 구현체 */
@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Comment 생성 - 트랜잭션으로 원자적 증가, commentCount 상한 초과 시 에러 */
  async create(
    comment: CommentEntity,
    maxCount: number,
    authorId?: string,
  ): Promise<CreateCommentResult> {
    return this.prisma.$transaction(async (tx) => {
      // 현재 Planet의 commentCount 확인
      const planet = await tx.planet.findUniqueOrThrow({
        where: { id: comment.planetId },
        select: { commentCount: true },
      });

      // 상한 초과 검사
      if (planet.commentCount >= maxCount) {
        throw new Error(
          `댓글 개수가 최대치(${maxCount})에 도달했습니다`,
        );
      }

      // Comment 레코드 생성
      const data = CommentMapper.toPrisma(comment);
      const createdComment = await tx.comment.create({
        data: {
          id: data.id,
          content: data.content,
          authorNickname: data.authorNickname,
          planetId: data.planetId,
          parentId: data.parentId,
          ...(authorId ? { authorId } : {}),
        },
      });

      // Planet의 commentCount 원자적 증가
      const updatedPlanet = await tx.planet.update({
        where: { id: comment.planetId },
        data: { commentCount: { increment: 1 } },
        select: { commentCount: true },
      });

      return {
        comment: CommentMapper.toDomain(createdComment),
        newCommentCount: updatedPlanet.commentCount,
      };
    });
  }

  /** Planet의 모든 댓글 조회 (최상위 댓글 기준, 답글 포함, 생성일시 오름차순) */
  async findByPlanetId(planetId: string): Promise<CommentEntity[]> {
    const comments = await this.prisma.comment.findMany({
      where: { planetId, parentId: null },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // 최상위 댓글과 답글을 모두 플랫하게 도메인 엔티티로 변환
    const entities: CommentEntity[] = [];
    for (const comment of comments) {
      entities.push(CommentMapper.toDomain(comment));
      for (const reply of comment.replies) {
        entities.push(CommentMapper.toDomain(reply));
      }
    }

    return entities;
  }

  /** ID로 댓글 조회 */
  async findById(id: string): Promise<CommentEntity | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) return null;
    return CommentMapper.toDomain(comment);
  }
}
