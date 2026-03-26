// UserService 단위 테스트

import { UserService } from '../user.service';
import { IUserRepository } from '../../../domain/ports/user-repository.port';
import { UserEntity } from '../../../domain/entities/user.entity';

// @clerk/backend 모킹
jest.mock('@clerk/backend', () => ({
  createClerkClient: () => ({
    users: {
      getUser: jest.fn().mockResolvedValue({
        id: 'user_abc123',
        emailAddresses: [{ id: 'idn_1', emailAddress: 'test@example.com' }],
        primaryEmailAddressId: 'idn_1',
        firstName: '테스트',
        lastName: '사용자',
        imageUrl: 'https://example.com/photo.jpg',
        externalAccounts: [{ provider: 'oauth_google' }],
      }),
    },
  }),
}));

describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUser = UserEntity.create({
    id: 'test-id',
    clerkId: 'user_abc123',
    email: 'test@example.com',
    name: '테스트 사용자',
    imageUrl: 'https://example.com/photo.jpg',
    providers: ['oauth_google'],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    mockRepository = {
      findByClerkId: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new UserService(mockRepository);
  });

  describe('findOrCreateByClerkId', () => {
    it('DB에 존재하는 사용자를 반환한다', async () => {
      mockRepository.findByClerkId.mockResolvedValue(mockUser);

      const result = await service.findOrCreateByClerkId('user_abc123');

      expect(result).toEqual(mockUser);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('DB에 없으면 Clerk API에서 가져와서 생성한다', async () => {
      mockRepository.findByClerkId.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockUser);

      const result = await service.findOrCreateByClerkId('user_abc123');

      expect(result).toEqual(mockUser);
      expect(mockRepository.create).toHaveBeenCalled();
    });
  });
});
