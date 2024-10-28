import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as SYS_MSG from '@constant/SystemMessages';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '@auth/dto/create-user.dto';
import UserService from '@user/user.service';
import { LoginDto } from '@auth/dto/login.dto';
import { CustomHttpException } from '@helpers/custom-http-filter';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async createNewUser(createUserDto: CreateUserDTO) {
    const userExists = await this.userService.getUserRecord({
      identifier: createUserDto.email,
      identifierType: 'email',
    });

    if (userExists) {
      throw new CustomHttpException(SYS_MSG.USER_ACCOUNT_EXIST, HttpStatus.BAD_REQUEST);
    }

    const hashSalt = Number(this.configService.get<number>('auth.hashSalt'));

    const hashedPwd = await bcrypt.hash(createUserDto.password, hashSalt);

    await this.userService.createUser({ ...createUserDto, password: hashedPwd });

    const user = await this.userService.getUserRecord({ identifier: createUserDto.email, identifierType: 'email' });

    if (!user) {
      throw new CustomHttpException(SYS_MSG.FAILED_TO_CREATE_USER, HttpStatus.BAD_REQUEST);
    }

    const access_token = this.jwtService.sign({
      id: user._id,
      sub: user._id,
      email: user.email,
      username: user.username,
    });

    const responsePayload = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };

    return {
      message: SYS_MSG.USER_CREATED_SUCCESSFULLY,
      access_token,
      data: responsePayload,
    };
  }

  async loginUser(loginDto: LoginDto, res: any) {
    const { email, password } = loginDto;

    const user = await this.userService.getUserRecord({
      identifier: email,
      identifierType: 'email',
    });

    if (!user) {
      throw new CustomHttpException(SYS_MSG.WRONG_PASSWORD, HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new CustomHttpException(SYS_MSG.WRONG_PASSWORD, HttpStatus.UNAUTHORIZED);
    }
    const payload = { id: user._id, sub: user._id, email: user.email, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    const cookie = this.setCookie(access_token, res);
    const responsePayload = {
      access_token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };

    return { message: SYS_MSG.LOGIN_SUCCESSFUL, ...responsePayload };
  }

  async setCookie(token: string, res: Response) {
    const cookieExpiry = this.configService.get<number>('auth.cookieExpiry');

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieExpiry,
    });
  }
}
