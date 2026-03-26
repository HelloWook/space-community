// Comment 비즈니스 로직 서비스

import { randomUUID } from 'crypto';
import {
  Injectable,
  Inject,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import {
  COMMENT_REPOSITORY,
  ICommentRepository,
} from '../../domain/ports/comment-repository.port';
import { CommentEntity } from '../../domain/entities/comment.entity';
import {
  CreateCommentDto,
  CommentResponseDto,
  CommentListResponseDto,
} from '../dto/comment.dto';

/** 댓글 최대 개수 상한 */
const MAX_COMMENT_COUNT = 50;

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  /** Planet에 댓글 작성 */
  async create(
    planetId: string,
    dto: CreateCommentDto,
    clerkId?: string,
  ): Promise<CommentResponseDto> {
    // 답글인 경우 부모 댓글 검증 (1단계 깊이 제한)
    if (dto.parentId) {
      const parent = await this.commentRepository.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException(
          `부모 댓글(${dto.parentId})을 찾을 수 없습니다`,
        );
      }
      // 부모가 이미 답글이면 거부 (답글의 답글 금지)
      if (parent.parentId !== null) {
        throw new BadRequestException(
          '답글에는 답글을 달 수 없습니다 (최대 1단계)',
        );
      }
    }

    // Comment 도메인 엔티티 생성
    const commentEntity = CommentEntity.create({
      id: randomUUID(),
      content: dto.content,
      authorNickname: dto.authorNickname,
      planetId,
      parentId: dto.parentId ?? null,
      createdAt: new Date(),
    });

    try {
      // 리포지토리를 통해 Comment 생성 (트랜잭션, 상한 검사 포함)
      const result = await this.commentRepository.create(
        commentEntity,
        MAX_COMMENT_COUNT,
        clerkId,
      );

      return this.toResponseDto(result.comment);
    } catch (error) {
      // Planet을 찾을 수 없는 경우
      if (error instanceof Error && error.message.includes('찾을 수 없')) {
        throw new NotFoundException(`Planet(${planetId})을 찾을 수 없습니다`);
      }
      // Prisma NotFoundError (findUniqueOrThrow)
      if (
        error instanceof Error &&
        (error.name === 'NotFoundError' ||
          error.message.includes('No Planet found'))
      ) {
        throw new NotFoundException(`Planet(${planetId})을 찾을 수 없습니다`);
      }
      // 댓글 상한 초과
      if (error instanceof Error && error.message.includes('최대치')) {
        throw new UnprocessableEntityException(
          '댓글 개수가 최대치(50)에 도달했습니다',
        );
      }
      throw error;
    }
  }

  /** Planet의 댓글 목록 조회 (트리 구조) */
  async findByPlanet(planetId: string): Promise<CommentListResponseDto> {
    const comments = await this.commentRepository.findByPlanetId(planetId);

    // 트리 구조로 변환: 최상위 댓글과 답글 분리
    const topLevelComments: CommentEntity[] = [];
    const repliesMap = new Map<string, CommentEntity[]>();

    for (const comment of comments) {
      if (comment.parentId === null) {
        topLevelComments.push(comment);
      } else {
        const replies = repliesMap.get(comment.parentId) ?? [];
        replies.push(comment);
        repliesMap.set(comment.parentId, replies);
      }
    }

    // 트리 구조 DTO 생성
    const data: CommentResponseDto[] = topLevelComments.map((comment) => {
      const replies = repliesMap.get(comment.id) ?? [];
      const dto = this.toResponseDto(comment);
      dto.replies = replies.map((reply) => {
        const replyDto = this.toResponseDto(reply);
        replyDto.replies = []; // 답글의 답글은 없음
        return replyDto;
      });
      return dto;
    });

    return {
      data,
      totalCount: comments.length,
    };
  }

  /** CommentEntity를 CommentResponseDto로 변환하는 헬퍼 */
  private toResponseDto(comment: CommentEntity): CommentResponseDto {
    const dto = new CommentResponseDto();
    dto.id = comment.id;
    dto.content = comment.content;
    dto.authorNickname = comment.authorNickname;
    dto.planetId = comment.planetId;
    dto.parentId = comment.parentId;
    dto.replies = [];
    dto.createdAt = comment.createdAt;
    return dto;
  }
}
