// Galaxy 도메인 엔티티 - 게시판 주제를 나타내는 최상위 엔티티

/** 3D 공간 좌표 */
export interface Position {
  x: number;
  y: number;
  z: number;
}

/** Galaxy 엔티티 생성에 필요한 속성 */
export interface GalaxyProps {
  id: string;
  name: string;
  description: string;
  position: Position;
  createdAt: Date;
  updatedAt: Date;
}

/** 은하계 도메인 엔티티 - 프레임워크 의존성 없는 순수 클래스 */
export class GalaxyEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly position: Position;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: GalaxyProps) {
    // 이름 유효성 검사
    if (!props.name || props.name.length < 1 || props.name.length > 50) {
      throw new Error('name은 1~50자여야 합니다');
    }

    // 설명 유효성 검사
    if (
      !props.description ||
      props.description.length < 1 ||
      props.description.length > 200
    ) {
      throw new Error('description은 1~200자여야 합니다');
    }

    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.position = props.position;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /** Galaxy 엔티티 생성 팩토리 메서드 */
  static create(props: GalaxyProps): GalaxyEntity {
    return new GalaxyEntity(props);
  }
}
