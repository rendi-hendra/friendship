import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import {
  FriendResponse,
  SendFriendRequest,
  UpdateStatusRequest,
} from '../model/friend.model';
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

  @Get('/current')
  @HttpCode(200)
  async getFriendsRequest(
    @Auth() user: User,
  ): Promise<WebResponse<FriendResponse[]>> {
    const result = await this.friendService.getFriendsRequest(user);
    return {
      data: result,
    };
  }

  @Get('/request')
  @HttpCode(200)
  async getFriendsResponse(
    @Auth() user: User,
  ): Promise<WebResponse<FriendResponse[]>> {
    const result = await this.friendService.getFriendsResponse(user);
    return {
      data: result,
    };
  }

  @Patch('/:userId')
  @HttpCode(200)
  async updateStatus(
    @Auth() user: User,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() request: UpdateStatusRequest,
  ): Promise<WebResponse<FriendResponse>> {
    request.userId = userId;
    const result = await this.friendService.updateStatus(user, request);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async list(@Auth() user: User): Promise<WebResponse<FriendResponse[]>> {
    const result = await this.friendService.list(user);
    return result;
  }
}
