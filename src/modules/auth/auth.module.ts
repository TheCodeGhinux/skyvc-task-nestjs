import { Module } from '@nestjs/common';
import RegistrationController from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import appConfig from '@config/auth.config';
import { Repository } from 'typeorm';
import AuthenticationService from './auth.service';
import UserService from '@user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/entities/user.schema';

@Module({
  controllers: [RegistrationController],
  providers: [AuthenticationService, Repository, UserService],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: appConfig().jwtSecret,
      signOptions: { expiresIn: `${appConfig().jwtExpiry}s` },
    }),
  ],
})
export class AuthModule {}
