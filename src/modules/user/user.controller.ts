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

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UpdateUserDocs()
  // @Patch(':userId')
  // async updateUser(
  //   @Request() req: { user: UserPayload },
  //   @Param('userId') userId: string,
  //   @Body() updatedUserDto: UpdateUserDto
  // ) {
  //   return this.userService.updateUser(userId, updatedUserDto, req.user);
  // }


  // @Get(':userId')
  // async getUser(@Req() req) {
  //   const username = req.user.username;
  //   console.log(username);
    
  //   return this.userService.getUserByUsername(username);
  // }

  @Get()
  async getUserByUsername(@Req() req) {
    const username = req.user.username;
    return await this.userService.getUserByUsername(username);
  }

  @Delete(':userId')
  @SoftDeleteUserDocs()
  async softDeleteUser(@Param('userId', ParseUUIDPipe) userId: string, @Req() req) {
    const authenticatedUserId = req['user'].id;

    return this.userService.softDeleteUser(userId, authenticatedUserId);
  }
}