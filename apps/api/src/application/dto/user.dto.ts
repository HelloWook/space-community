// User DTO - 요청/응답 데이터 전송 객체

/** 사용자 응답 DTO */
export class UserResponseDto {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  providers: string[];
}

/** Webhook에서 사용자 생성 시 사용하는 DTO */
export class CreateUserFromWebhookDto {
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  providers: string[];
}

/** Webhook에서 사용자 갱신 시 사용하는 DTO */
export class UpdateUserFromWebhookDto {
  email: string;
  name: string | null;
  imageUrl: string | null;
  providers: string[];
}
