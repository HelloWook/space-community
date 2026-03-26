// Comment 리포지토리 포트 - 헥사고날 아키텍처의 출력 포트

import { CommentEntity } from '../entities/comment.entity';

/** Comment 리포지토리 주입 토큰 */
export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

/** Comment 생성 결과 */
export interface CreateCommentResult {
  comment: CommentEntity;
  newCommentCount: number;
}

/** Comment 리포지토리 인터페이스 */
export interface ICommentRepository {
  /** Comment 생성 (트랜잭션으로 원자적 증가, maxCount 초과 시 에러) */
  create(
    comment: CommentEntity,
    maxCount: number,
    authorId?: string,
  ): Promise<CreateCommentResult>;

  /** Planet의 모든 댓글 조회 (최상위 댓글 + 답글 포함) */
  findByPlanetId(planetId: string): Promise<CommentEntity[]>;

  /** ID로 댓글 조회 */
  findById(id: string): Promise<CommentEntity | null>;
}
