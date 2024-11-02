import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from '@user/dto/update-user-dto';
import { UserPayload } from '@user/interfaces/user-payload.interface';
import UserService from '@user/user.service';
import { skipAuth } from '@helpers/skipAuth';
// import { Request, Response } from 'express';
import * as path from 'path';
import { SoftDeleteUserDocs, UpdateUserDocs } from '@user/docs/user-swagger.doc';
import { AuthGuard } from '@/guards/auth.guard';
import { UserGuard, UsernameGuard } from '@/guards/user.guard';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UpdateUserDocs()
  @UseGuards(UserGuard)
  @Patch(':userId')
  async updateUser(
    @Req() req: { user: UserPayload },
    @Body() updatedUserDto: UpdateUserDto
  ) {
    const userId = req.user.id;
    return this.userService.updateUser(userId, updatedUserDto);
  }


  @UseGuards(UserGuard)
  @Get(':userId')
  async getUser(@Req() req) {
    const userId = req.user.id;
    return this.userService.findUserById(userId);
  }

  @Get()
  @UseGuards(UsernameGuard)
  async getUserByUsername(@Req() req) {
    const username = req.user.username;
    return await this.userService.getUserByUsername(username);
  }

  @UseGuards(UserGuard)
  @Delete(':userId')
  @SoftDeleteUserDocs()
  async softDeleteUser(@Param('userId', ParseUUIDPipe) userId: string, @Req() req) {
    return this.userService.softDeleteUser(userId);
  }
}
