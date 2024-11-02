import { CustomHttpException } from "@/helpers/custom-http-filter";
import { Injectable, CanActivate, ExecutionContext, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as SYS_MSG from "@constant/SystemMessages";
import UserService from "@/modules/user/user.service";
import { UserType } from "@/modules/user/entities/user.schema";
import { AuthGuard } from "./auth.guard";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private authGuard: AuthGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.authGuard.extractTokenFromRequest(request);

    if (!token) {
      throw new CustomHttpException(SYS_MSG.UNAUTHENTICATED_MESSAGE, HttpStatus.UNAUTHORIZED);
    }

    const payload = request.user;
    const targetUserId = request.params.userId;

    if (!payload || !payload.id) {
      throw new CustomHttpException(SYS_MSG.UNAUTHENTICATED_MESSAGE, HttpStatus.UNAUTHORIZED);
    }

    // Fetch the authenticated user's details
    const user = await this.userService.getUserById(payload.id);
    if (!user) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND("User"), HttpStatus.NOT_FOUND);
    }

    // Admins are automatically authorized
    if (user.role === UserType.ADMIN) {
      return true;
    }

    // Check if the user is trying to access their own account
    if (targetUserId !== payload.id) {
      throw new CustomHttpException(SYS_MSG.UNAUTHORIZED_MESSAGE, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}

export class UsernameGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private authGuard: AuthGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.authGuard.extractTokenFromRequest(request);

    if (!token) {
      throw new CustomHttpException(SYS_MSG.UNAUTHENTICATED_MESSAGE, HttpStatus.UNAUTHORIZED);
    }

    const payload = request.user;
    const targetUsername = request.params.username;

    if (!payload || !payload.id) {
      throw new CustomHttpException(SYS_MSG.UNAUTHENTICATED_MESSAGE, HttpStatus.UNAUTHORIZED);
    }

    // Fetch the authenticated user's details
    const user = await this.userService.getUserByUsername(payload.username);
    if (!user) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND("User"), HttpStatus.NOT_FOUND);
    }

    // Admins are automatically authorized
    if (user.data.role === UserType.ADMIN) {
      return true;
    }

    // Check if the user is trying to access their own account
    if (targetUsername !== payload.username) {
      throw new CustomHttpException(SYS_MSG.UNAUTHORIZED_MESSAGE, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
