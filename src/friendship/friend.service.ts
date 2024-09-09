import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { FriendResponse, SendFriendRequest } from '../model/friend.model';
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
}
