// Clerk Webhook 수신 컨트롤러

import {
  Controller,
  Post,
  Headers,
  Req,
  RawBodyRequest,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Webhook } from 'svix';
import { UserService } from '../../application/services/user.service';
import type { Request } from 'express';

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string; id: string }>;
    primary_email_address_id?: string;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
    external_accounts?: Array<{ provider: string }>;
  };
}

@Controller('api/webhooks/clerk')
export class ClerkWebhookController {
  private readonly logger = new Logger(ClerkWebhookController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers() headers: Record<string, string>,
  ): Promise<{ received: true }> {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret이 설정되지 않았습니다');
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Raw body를 읽을 수 없습니다');
    }

    // Svix 서명 검증
    let event: ClerkWebhookEvent;
    try {
      const wh = new Webhook(webhookSecret);
      event = wh.verify(rawBody.toString(), {
        'svix-id': headers['svix-id'],
        'svix-timestamp': headers['svix-timestamp'],
        'svix-signature': headers['svix-signature'],
      }) as ClerkWebhookEvent;
    } catch {
      throw new BadRequestException('Webhook 서명 검증에 실패했습니다');
    }

    const { type, data } = event;
    this.logger.log(`Webhook 이벤트 수신: ${type}`);

    switch (type) {
      case 'user.created':
      case 'user.updated': {
        const primaryEmail = data.email_addresses?.find(
          (e) => e.id === data.primary_email_address_id,
        );
        const name = [data.first_name, data.last_name]
          .filter(Boolean)
          .join(' ') || null;
        const providers =
          data.external_accounts?.map((a) => a.provider) ?? [];

        if (type === 'user.created') {
          await this.userService.createFromWebhook({
            clerkId: data.id,
            email: primaryEmail?.email_address ?? '',
            name,
            imageUrl: data.image_url ?? null,
            providers,
          });
        } else {
          await this.userService.updateFromWebhook(data.id, {
            email: primaryEmail?.email_address ?? '',
            name,
            imageUrl: data.image_url ?? null,
            providers,
          });
        }
        break;
      }
      case 'user.deleted':
        await this.userService.deleteByClerkId(data.id);
        break;
      default:
        this.logger.warn(`처리하지 않는 이벤트 타입: ${type}`);
    }

    return { received: true };
  }
}
