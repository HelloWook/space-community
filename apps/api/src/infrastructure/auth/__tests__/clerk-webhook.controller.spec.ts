// Clerk Webhook 컨트롤러 단위 테스트

import { Test, TestingModule } from '@nestjs/testing';
import { ClerkWebhookController } from '../clerk-webhook.controller';
import { UserService } from '../../../application/services/user.service';

// svix 모킹
jest.mock('svix', () => ({
  Webhook: jest.fn().mockImplementation(() => ({
    verify: jest.fn().mockReturnValue({ type: 'user.created', data: {} }),
  })),
}));

describe('ClerkWebhookController', () => {
  let controller: ClerkWebhookController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    process.env.CLERK_WEBHOOK_SECRET = 'whsec_test';

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClerkWebhookController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createFromWebhook: jest.fn(),
            updateFromWebhook: jest.fn(),
            deleteByClerkId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(ClerkWebhookController);
    userService = module.get(UserService) as jest.Mocked<UserService>;
  });

  it('user.created 이벤트로 사용자를 생성한다', async () => {
    const payload = {
      type: 'user.created',
      data: {
        id: 'user_abc123',
        email_addresses: [
          { email_address: 'test@example.com', id: 'idn_1' },
        ],
        primary_email_address_id: 'idn_1',
        first_name: '홍',
        last_name: '길동',
        image_url: 'https://img.clerk.com/photo.jpg',
        external_accounts: [
          { provider: 'oauth_google' },
        ],
      },
    };

    const headers = {
      'svix-id': 'msg_123',
      'svix-timestamp': '1234567890',
      'svix-signature': 'v1,signature',
    };

    // svix verify가 payload를 반환하도록 설정
    const { Webhook } = require('svix');
    Webhook.mockImplementation(() => ({
      verify: jest.fn().mockReturnValue(payload),
    }));

    // 새 컨트롤러 인스턴스 생성
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClerkWebhookController],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    }).compile();
    const ctrl = module.get(ClerkWebhookController);

    await ctrl.handleWebhook(JSON.stringify(payload), headers);

    expect(userService.createFromWebhook).toHaveBeenCalledWith({
      clerkId: 'user_abc123',
      email: 'test@example.com',
      name: '홍 길동',
      imageUrl: 'https://img.clerk.com/photo.jpg',
      providers: ['oauth_google'],
    });
  });

  it('user.deleted 이벤트로 사용자를 삭제한다', async () => {
    const payload = {
      type: 'user.deleted',
      data: { id: 'user_abc123' },
    };

    const { Webhook } = require('svix');
    Webhook.mockImplementation(() => ({
      verify: jest.fn().mockReturnValue(payload),
    }));

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClerkWebhookController],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    }).compile();
    const ctrl = module.get(ClerkWebhookController);

    await ctrl.handleWebhook(JSON.stringify(payload), {
      'svix-id': 'msg_456',
      'svix-timestamp': '1234567890',
      'svix-signature': 'v1,signature',
    });

    expect(userService.deleteByClerkId).toHaveBeenCalledWith('user_abc123');
  });
});
