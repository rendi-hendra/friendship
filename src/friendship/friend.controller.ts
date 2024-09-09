import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendResponse, SendFriendRequest } from '../model/friend.model';
import { WebResponse } from '../model/web.model';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';

@Controller('/api/friends')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Post()
  @HttpCode(200)
  async sendFriendRequest(
    @Auth() user: User,
    @Body() request: SendFriendRequest,
  ): Promise<WebResponse<FriendResponse>> {
    const result = await this.friendService.sendFriendRequest(user, request);
    return {
      data: result,
    };
  }
}
