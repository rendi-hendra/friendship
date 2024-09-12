import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { FriendshipStatus, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteFriends();
    await this.deleteUser();
  }

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
          token: 'test2',
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

  async getuserId(): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async updateStatus(status: FriendshipStatus) {
    return await this.prismaService.friendship.update({
      where: {
        userId_friendId: {
          userId: (await this.getuserId()).id,
          friendId: (await this.getFriendId()).id,
        },
      },
      data: {
        status: status,
      },
    });
  }

  async deleteFriends() {
    await this.prismaService.friendship.deleteMany({
      where: { userId: (await this.getuserId()).id },
    });
  }
}
