// Star 도메인 엔티티 - 게시글에 대한 좋아요

/** Star 엔티티 생성에 필요한 속성 */
export interface StarProps {
  id: string;
  giverNickname: string;
  planetId: string;
  createdAt: Date;
}

/** 별 도메인 엔티티 - 프레임워크 의존성 없는 순수 클래스 */
export class StarEntity {
  readonly id: string;
  readonly giverNickname: string;
  readonly planetId: string;
  readonly createdAt: Date;

  private constructor(props: StarProps) {
    // 별 부여자 닉네임 유효성 검사
    if (
      !props.giverNickname ||
      props.giverNickname.length < 1 ||
      props.giverNickname.length > 20
    ) {
      throw new Error('giverNickname은 1~20자여야 합니다');
    }

    this.id = props.id;
    this.giverNickname = props.giverNickname;
    this.planetId = props.planetId;
    this.createdAt = props.createdAt;
  }

  /** Star 엔티티 생성 팩토리 메서드 */
  static create(props: StarProps): StarEntity {
    return new StarEntity(props);
  }
}
