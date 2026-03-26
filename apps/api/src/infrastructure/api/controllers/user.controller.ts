// User API 컨트롤러

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserService } from '../../../application/services/user.service';
import { UserResponseDto } from '../../../application/dto/user.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 현재 로그인한 사용자 정보 조회 */
  @Get('me')
  @UseGuards(ClerkAuthGuard)
  async getMe(@CurrentUser() clerkId: string): Promise<UserResponseDto> {
    const user = await this.userService.findOrCreateByClerkId(clerkId);
    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
      providers: user.providers,
    };
  }
}
