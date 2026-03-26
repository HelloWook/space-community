// User 도메인 엔티티 - 프레임워크 의존성 없는 순수 클래스

/** User 엔티티 생성에 필요한 속성 */
export interface UserProps {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  providers: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** 사용자 도메인 엔티티 */
export class UserEntity {
  readonly id: string;
  readonly clerkId: string;
  readonly email: string;
  readonly name: string | null;
  readonly imageUrl: string | null;
  readonly providers: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: UserProps) {
    if (!props.clerkId || props.clerkId.length === 0) {
      throw new Error('clerkId는 비어있을 수 없습니다');
    }

    if (!props.email || props.email.length === 0) {
      throw new Error('email은 비어있을 수 없습니다');
    }

    this.id = props.id;
    this.clerkId = props.clerkId;
    this.email = props.email;
    this.name = props.name;
    this.imageUrl = props.imageUrl;
    this.providers = props.providers;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /** User 엔티티 생성 팩토리 메서드 */
  static create(props: UserProps): UserEntity {
    return new UserEntity(props);
  }
}
