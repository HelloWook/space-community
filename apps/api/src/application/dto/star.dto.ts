// Star 관련 요청/응답 DTO 정의

/** Star 생성 요청 DTO — 회원 전용이므로 클라이언트 입력 필드 없음 */
export class CreateStarDto {}

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

  /** 해당 사용자가 이미 별을 주었는지 여부 */
  alreadyGiven: boolean;

  /** 생성일시 */
  createdAt: Date;
}
