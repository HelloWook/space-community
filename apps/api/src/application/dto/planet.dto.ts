// Planet 관련 요청/응답 DTO 정의

import { IsString, Length, IsOptional, Matches, IsIn, IsBoolean } from 'class-validator';
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

  /** 댓글 개수 */
  commentCount: number;

  /** 3D 공간 좌표 */
  position: Position;

  /** 메인 색상 (HEX) */
  mainColor: string;

  /** 보조 색상 (HEX) */
  subColor: string;

  /** 크기 */
  size: string;

  /** 형태 */
  shape: string;

  /** 표면 패턴 */
  pattern: string;

  /** 고리 유무 */
  hasRing: boolean;

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

  /** 메인 색상 (HEX #RRGGBB) */
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/, { message: 'mainColor는 유효한 HEX 색상이어야 합니다 (#RRGGBB)' })
  mainColor?: string;

  /** 보조 색상 (HEX #RRGGBB) */
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/, { message: 'subColor는 유효한 HEX 색상이어야 합니다 (#RRGGBB)' })
  subColor?: string;

  /** 크기 */
  @IsOptional()
  @IsString()
  @IsIn(['SMALL', 'MEDIUM', 'LARGE'])
  size?: string;

  /** 형태 */
  @IsOptional()
  @IsString()
  @IsIn(['SPHERE', 'BOX', 'TETRAHEDRON', 'OCTAHEDRON', 'DODECAHEDRON', 'TORUS', 'CYLINDER', 'CONE'])
  shape?: string;

  /** 표면 패턴 */
  @IsOptional()
  @IsString()
  @IsIn(['SMOOTH', 'CRATER', 'STRIPE', 'CLOUD'])
  pattern?: string;

  /** 고리 유무 */
  @IsOptional()
  @IsBoolean()
  hasRing?: boolean;
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
