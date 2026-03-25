// Planet 관련 요청/응답 DTO 정의

import { IsString, Length } from 'class-validator';
import { Position } from '../../domain/entities/galaxy.entity';

/** Planet 요약 DTO (content 제외) */
export class PlanetSummaryDto {
  /** Planet 고유 ID */
  id: string;

  /** 게시글 제목 */
  title: string;

  /** 작성자 닉네임 */
  authorNickname: string;

  /** 별 개수 */
  starCount: number;

  /** 3D 공간 좌표 */
  position: Position;

  /** 생성일시 */
  createdAt: Date;
}

/** Planet 생성 요청 DTO */
export class CreatePlanetDto {
  /** 게시글 제목 (1~100자) */
  @IsString()
  @Length(1, 100)
  title: string;

  /** 게시글 내용 (1~10000자) */
  @IsString()
  @Length(1, 10000)
  content: string;

  /** 작성자 닉네임 (1~20자) */
  @IsString()
  @Length(1, 20)
  authorNickname: string;
}

/** Planet 상세 응답 DTO (content 포함) */
export class PlanetDetailResponseDto extends PlanetSummaryDto {
  /** 게시글 내용 */
  content: string;

  /** 소속 Galaxy ID */
  galaxyId: string;
}

/** Planet 목록 응답 DTO (커서 기반 페이지네이션) */
export class PlanetListResponseDto {
  /** Planet 요약 목록 */
  data: PlanetSummaryDto[];

  /** 다음 페이지 커서 (null이면 마지막 페이지) */
  nextCursor: string | null;

  /** 다음 페이지 존재 여부 */
  hasMore: boolean;
}
