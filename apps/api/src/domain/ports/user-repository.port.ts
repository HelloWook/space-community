// User 리포지토리 포트 - 헥사고날 아키텍처의 출력 포트

import { UserEntity } from '../entities/user.entity';

/** User 리포지토리 주입 토큰 */
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

/** User 리포지토리 인터페이스 */
export interface IUserRepository {
  /** clerkId로 사용자 조회 */
  findByClerkId(clerkId: string): Promise<UserEntity | null>;

  /** 이메일로 사용자 조회 */
  findByEmail(email: string): Promise<UserEntity | null>;

  /** 사용자 생성 */
  create(user: UserEntity): Promise<UserEntity>;

  /** clerkId로 사용자 갱신 */
  update(clerkId: string, data: Partial<Pick<UserEntity, 'email' | 'name' | 'imageUrl' | 'providers'>>): Promise<UserEntity>;

  /** clerkId로 사용자 삭제 */
  delete(clerkId: string): Promise<void>;
}
