import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import appConfig from '../../config/auth.config';
import { IS_PUBLIC_KEY } from '../helpers/skipAuth';
import * as SYS_MSG from '../constant/SystemMessages';
import { CustomHttpException } from '../helpers/custom-http-filter';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private authGuard: AuthGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.authGuard.extractTokenFromRequest(request);

    if (!token) {
      throw new CustomHttpException(SYS_MSG.UNAUTHENTICATED_MESSAGE, HttpStatus.UNAUTHORIZED);
    }

    const payload = request.user;

    if (!payload || payload.role !== 'admin') {
      throw new CustomHttpException(SYS_MSG.UNAUTHORIZED_MESSAGE, HttpStatus.FORBIDDEN);
    }

    return true;


    return true;
  }
}