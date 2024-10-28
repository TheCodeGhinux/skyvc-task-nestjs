import {
  ApiTags,
} from '@nestjs/swagger';
import * as SYS_MSG from '@constant/SystemMessages';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  Get,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateUserDTO } from '@auth/dto/create-user.dto';
import { skipAuth } from '@helpers/skipAuth';
import AuthenticationService from '@auth/auth.service';
import { LoginResponseDto } from '@auth/dto/login-response.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { ChangePasswordDto } from '@auth/dto/change-password.dto';
import { LoginUserDocs, RegisterUserDocs } from '@auth/docs/auth-swagger.doc';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export default class RegistrationController {
  constructor(private authService: AuthenticationService) {}

  @skipAuth()
  @RegisterUserDocs()
  @Post('register')
  @HttpCode(201)
  public async register(@Body() body: CreateUserDTO): Promise<any> {
    return this.authService.createNewUser(body);
  }

  @skipAuth()
  @LoginUserDocs()
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.loginUser(loginDto, res);
  }
}
