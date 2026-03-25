// Galaxy 관련 요청/응답 DTO 정의

import { IsString, Length } from 'class-validator';
import { Position } from '../../domain/entities/galaxy.entity';

/** 개별 Galaxy 응답 DTO */
export class GalaxyResponseDto {
  /** Galaxy 고유 ID */
  id: string;

  /** Galaxy 이름 */
  name: string;

  /** Galaxy 설명 */
  description: string;

  /** 3D 공간 좌표 */
  position: Position;

  /** 소속 Planet 개수 */
  planetCount: number;

  /** 생성일시 */
  createdAt: Date;
}

/** Galaxy 목록 응답 DTO */
export class GalaxyListResponseDto {
  /** Galaxy 목록 */
  data: GalaxyResponseDto[];
}

/** Galaxy 생성 요청 DTO */
export class CreateGalaxyDto {
  /** Galaxy 이름 (1~50자) */
  @IsString()
  @Length(1, 50)
  name: string;

  /** Galaxy 설명 (1~200자) */
  @IsString()
  @Length(1, 200)
  description: string;
}
