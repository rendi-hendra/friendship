import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  FriendResponse,
  SendFriendRequest,
  UpdateStatusRequest,
} from '../model/friend.model';
import { FriendValidation } from './friend.validation';
import { User } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async sendFriendRequest(
    user: User,
    request: SendFriendRequest,
  ): Promise<FriendResponse> {
    this.logger.debug(`Send request friend ${JSON.stringify(request)}`);

    const friendRequest: SendFriendRequest = this.validationService.validate(
      FriendValidation.SendRequest,
      request,
    );

    const userId = await this.prismaService.user.findFirst({
      where: {
        id: friendRequest.friendId,
      },
    });

    if (!userId) {
      throw new HttpException('Friend not found', 404);
    }

    if (user.id == friendRequest.friendId) {
      throw new HttpException('Cannot send friend request to yourself', 400);
    }

    const friend = await this.prismaService.friendship.create({
      data: {
        userId: user.id,
        friendId: friendRequest.friendId,
      },
      include: {
        user: true,
        friend: true,
      },
    });

    return {
      userId: friend.userId,
      friendId: friend.friendId,
      status: friend.status,
      createdAt: friend.createdAt,
    };
  }

  async getFriendsRequest(user: User): Promise<FriendResponse[]> {
    const friends = await this.prismaService.friendship.findMany({
      where: {
        userId: user.id,
      },
      include: {
        friend: true,
      },
    });
    return friends.map((friend) => {
      return {
        userId: friend.userId,
        friendId: friend.friendId,
        username: friend.friend.username,
        status: friend.status,
        createdAt: friend.createdAt,
      };
    });
  }

  async getFriendsResponse(user: User): Promise<FriendResponse[]> {
    const friends = await this.prismaService.friendship.findMany({
      where: {
        friendId: user.id,
        status: 'PENDING',
      },
      include: {
        user: true,
        friend: true,
      },
    });
    return friends.map((friend) => {
      return {
        userId: friend.userId,
        username: friend.user.username,
        friendId: friend.friendId,
        status: friend.status,
        createdAt: friend.createdAt,
      };
    });
  }

  async updateStatus(
    user: User,
    request: UpdateStatusRequest,
  ): Promise<FriendResponse> {
    const updateRequest: UpdateStatusRequest = this.validationService.validate(
      FriendValidation.UpdateStatus,
      request,
    );

    let friend = await this.prismaService.friendship.findFirst({
      where: {
        userId: request.userId,
        friendId: user.id,
        status: 'PENDING',
      },
    });

    if (!friend) {
      throw new HttpException('Friend not found', 404);
    }

    friend = await this.prismaService.friendship.update({
      where: {
        userId_friendId: {
          userId: friend.userId,
          friendId: user.id,
        },
      },
      data: {
        status: updateRequest.status,
      },
    });

    return {
      userId: friend.userId,
      friendId: friend.friendId,
      status: friend.status,
      createdAt: friend.createdAt,
    };

    // const updatedFriend = await this.prismaService.friendship.update({
    //   where: {
    //     userId: friend.userId,
    //     friendId: friend.friendId,
    //   },
    //   data: {
    //     status: request.status,
    //   },
    // });
    // return {
    //   userId: updatedFriend.userId,
    //   friendId: updatedFriend.friendId,
    //   status: updatedFriend.status,
    //   createdAt: updatedFriend.createdAt,
    // };
  }
}
