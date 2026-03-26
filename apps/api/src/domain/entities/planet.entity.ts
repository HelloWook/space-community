// Planet 도메인 엔티티 - 은하계 내의 개별 게시글

import { Position } from './galaxy.entity';

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
const VALID_SIZES = ['SMALL', 'MEDIUM', 'LARGE'] as const;
const VALID_SHAPES = ['SPHERE', 'BOX', 'TETRAHEDRON', 'OCTAHEDRON', 'DODECAHEDRON', 'TORUS', 'CYLINDER', 'CONE'] as const;
const VALID_PATTERNS = ['SMOOTH', 'CRATER', 'STRIPE', 'CLOUD'] as const;

/** Planet 엔티티 생성에 필요한 속성 */
export interface PlanetProps {
  id: string;
  title: string;
  content: string;
  authorNickname: string;
  starCount: number;
  commentCount?: number;
  position: Position;
  galaxyId: string;
  createdAt: Date;
  updatedAt: Date;
  // 외형 속성 (optional — 기본값 적용)
  mainColor?: string;
  subColor?: string;
  size?: string;
  shape?: string;
  pattern?: string;
  hasRing?: boolean;
}

/** 행성 도메인 엔티티 - 프레임워크 의존성 없는 순수 클래스 */
export class PlanetEntity {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly authorNickname: string;
  readonly starCount: number;
  readonly commentCount: number;
  readonly position: Position;
  readonly galaxyId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  // 외형 속성
  readonly mainColor: string;
  readonly subColor: string;
  readonly size: string;
  readonly shape: string;
  readonly pattern: string;
  readonly hasRing: boolean;

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

    // 외형 유효성 검사
    const mainColor = props.mainColor ?? '#4A90D9';
    const subColor = props.subColor ?? '#2C5F8A';
    const size = props.size ?? 'MEDIUM';
    const shape = props.shape ?? 'SPHERE';
    const pattern = props.pattern ?? 'SMOOTH';

    if (!HEX_COLOR_REGEX.test(mainColor)) {
      throw new Error('mainColor는 유효한 HEX 색상이어야 합니다 (#RRGGBB)');
    }
    if (!HEX_COLOR_REGEX.test(subColor)) {
      throw new Error('subColor는 유효한 HEX 색상이어야 합니다 (#RRGGBB)');
    }
    if (!VALID_SIZES.includes(size as any)) {
      throw new Error(`size는 ${VALID_SIZES.join(', ')} 중 하나여야 합니다`);
    }
    if (!VALID_SHAPES.includes(shape as any)) {
      throw new Error(`shape는 ${VALID_SHAPES.join(', ')} 중 하나여야 합니다`);
    }
    if (!VALID_PATTERNS.includes(pattern as any)) {
      throw new Error(`pattern은 ${VALID_PATTERNS.join(', ')} 중 하나여야 합니다`);
    }

    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.authorNickname = props.authorNickname;
    this.starCount = props.starCount;
    this.commentCount = props.commentCount ?? 0;
    this.position = props.position;
    this.galaxyId = props.galaxyId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.mainColor = mainColor;
    this.subColor = subColor;
    this.size = size;
    this.shape = shape;
    this.pattern = pattern;
    this.hasRing = props.hasRing ?? false;
  }

  /** Planet 엔티티 생성 팩토리 메서드 */
  static create(props: PlanetProps): PlanetEntity {
    return new PlanetEntity(props);
  }
}
