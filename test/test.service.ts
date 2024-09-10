import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  //   async deleteAll() {
  //     await this.deletePosts();
  //     await this.deleteUser();
  //   }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: {
          contains: 'test',
        },
      },
    });
  }

  async createUser() {
    await this.prismaService.user.createMany({
      data: [
        {
          username: 'test',
          password: await bcrypt.hash('test', 10),
          token: 'test',
        },
        {
          username: 'test2',
          password: await bcrypt.hash('test', 10),
          token: 'test',
        },
      ],
    });
  }

  async getUser(): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async getFriendId(): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test2',
      },
    });
  }

  async deleteFriends() {
    await this.prismaService.friendship.deleteMany({
      where: {
        friendId: (await this.getFriendId()).id,
      },
    });
  }
}
