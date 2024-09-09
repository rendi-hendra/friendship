import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { FriendModule } from './friendship/friend.module';

@Module({
  imports: [CommonModule, UserModule, FriendModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
