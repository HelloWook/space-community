// Star 관련 요청/응답 DTO 정의

import { IsString, Length } from 'class-validator';

/** Star 생성 요청 DTO */
export class CreateStarDto {
  /** 별 부여자 닉네임 (1~20자) */
  @IsString()
  @Length(1, 20)
  giverNickname: string;
}

/** Star 응답 DTO */
export class StarResponseDto {
  /** Star 고유 ID */
  id: string;

  /** 별 부여자 닉네임 */
  giverNickname: string;

  /** 대상 Planet ID */
  planetId: string;

  /** 별 부여 후 총 별 개수 */
  newStarCount: number;

  /** 생성일시 */
  createdAt: Date;
}
