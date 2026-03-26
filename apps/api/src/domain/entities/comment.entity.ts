// Comment 도메인 엔티티 - 행성(게시글)에 대한 위성 댓글

/** Comment 엔티티 생성에 필요한 속성 */
export interface CommentProps {
  id: string;
  content: string;
  authorNickname: string;
  planetId: string;
  parentId: string | null;
  createdAt: Date;
}

/** 댓글 도메인 엔티티 - 프레임워크 의존성 없는 순수 클래스 */
export class CommentEntity {
  readonly id: string;
  readonly content: string;
  readonly authorNickname: string;
  readonly planetId: string;
  readonly parentId: string | null;
  readonly createdAt: Date;

  private constructor(props: CommentProps) {
    // 댓글 내용 유효성 검사
    if (!props.content || props.content.length < 1 || props.content.length > 500) {
      throw new Error('content는 1~500자여야 합니다');
    }

    // 작성자 닉네임 유효성 검사
    if (
      !props.authorNickname ||
      props.authorNickname.length < 1 ||
      props.authorNickname.length > 20
    ) {
      throw new Error('authorNickname은 1~20자여야 합니다');
    }

    this.id = props.id;
    this.content = props.content;
    this.authorNickname = props.authorNickname;
    this.planetId = props.planetId;
    this.parentId = props.parentId;
    this.createdAt = props.createdAt;
  }

  /** Comment 엔티티 생성 팩토리 메서드 */
  static create(props: CommentProps): CommentEntity {
    return new CommentEntity(props);
  }
}
