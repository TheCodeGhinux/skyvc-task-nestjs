import { Module } from '@nestjs/common';
import UserService from '@user/user.service';
import { UserController } from '@user/user.controller';
import { DatabaseModule } from '@/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  exports: [UserService],
})
export class UserModule {}
