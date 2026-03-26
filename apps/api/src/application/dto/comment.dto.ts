// Comment 관련 요청/응답 DTO 정의

import { IsString, Length, IsOptional } from 'class-validator';

/** Comment 생성 요청 DTO */
export class CreateCommentDto {
  /** 댓글 내용 (1~500자) */
  @IsString()
  @Length(1, 500)
  content: string;

  /** 작성자 닉네임 (1~20자) */
  @IsString()
  @Length(1, 20)
  authorNickname: string;

  /** 부모 댓글 ID (답글인 경우) */
  @IsOptional()
  @IsString()
  parentId?: string;
}

/** Comment 응답 DTO */
export class CommentResponseDto {
  /** Comment 고유 ID */
  id: string;

  /** 댓글 내용 */
  content: string;

  /** 작성자 닉네임 */
  authorNickname: string;

  /** 대상 Planet ID */
  planetId: string;

  /** 부모 댓글 ID */
  parentId: string | null;

  /** 답글 목록 */
  replies: CommentResponseDto[];

  /** 생성일시 */
  createdAt: Date;
}

/** Comment 목록 응답 DTO */
export class CommentListResponseDto {
  /** 댓글 목록 (트리 구조) */
  data: CommentResponseDto[];

  /** 전체 댓글 수 */
  totalCount: number;
}
