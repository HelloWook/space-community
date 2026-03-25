// Planet 도메인 엔티티 - 은하계 내의 개별 게시글

import { Position } from './galaxy.entity';

/** Planet 엔티티 생성에 필요한 속성 */
export interface PlanetProps {
  id: string;
  title: string;
  content: string;
  authorNickname: string;
  starCount: number;
  position: Position;
  galaxyId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** 행성 도메인 엔티티 - 프레임워크 의존성 없는 순수 클래스 */
export class PlanetEntity {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly authorNickname: string;
  readonly starCount: number;
  readonly position: Position;
  readonly galaxyId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: PlanetProps) {
    // 제목 유효성 검사
    if (!props.title || props.title.length < 1 || props.title.length > 100) {
      throw new Error('title은 1~100자여야 합니다');
    }

    // 내용 유효성 검사
    if (
      !props.content ||
      props.content.length < 1 ||
      props.content.length > 10000
    ) {
      throw new Error('content는 1~10000자여야 합니다');
    }

    // 작성자 닉네임 유효성 검사
    if (
      !props.authorNickname ||
      props.authorNickname.length < 1 ||
      props.authorNickname.length > 20
    ) {
      throw new Error('authorNickname은 1~20자여야 합니다');
    }

    // 별 개수 유효성 검사
    if (props.starCount < 0 || props.starCount > 100) {
      throw new Error('starCount는 0~100 사이여야 합니다');
    }

    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.authorNickname = props.authorNickname;
    this.starCount = props.starCount;
    this.position = props.position;
    this.galaxyId = props.galaxyId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /** Planet 엔티티 생성 팩토리 메서드 */
  static create(props: PlanetProps): PlanetEntity {
    return new PlanetEntity(props);
  }
}
