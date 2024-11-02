import { HttpStatus, Injectable } from '@nestjs/common';
import UserResponseDTO from '@user/dto/user-response.dto';
import UpdateUserRecordOption from '@user/options/UpdateUserRecordOption';
import UserIdentifierOptionsType from '@user/options/UserIdentifierOptions';
import * as SYS_MSG from '../../constant/SystemMessages';
import { CustomHttpException } from '../../helpers/custom-http-filter';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export default class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserPayload: any): Promise<User> {
    const newUser = new this.userModel(createUserPayload);
    return await newUser.save();
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new CustomHttpException(SYS_MSG.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      message: SYS_MSG.RESOURCE_FOUND('User'),
      data: user,
    };
  }

  async updateUserRecord(userUpdateOptions: UpdateUserRecordOption) {
    const { updatePayload, identifierOptions } = userUpdateOptions;

    const user = await this.getUserRecord(identifierOptions);

    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updatePayload);
    await this.userModel.findByIdAndUpdate(user._id, user, { new: true });
  }

  private async getUserByEmail(email: string) {
    const user: UserResponseDTO = await this.userModel.findOne({ email });
    return user;
  }

  async getUserByUsername(username: string) {
    const user: UserResponseDTO = await this.userModel.findOne({ username });
    if(!user) {
      throw new CustomHttpException(SYS_MSG.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      message: SYS_MSG.RESOURCE_FOUND('User'),
      data: user,
    };
  }

  async getUserById(identifier: string) {
    const user: UserResponseDTO = await this.userModel.findById(identifier);
    return user;
  }

  async getUserRecord(identifierOptions: UserIdentifierOptionsType) {
    const { identifier, identifierType } = identifierOptions;

    const GetRecord = {
      id: async () => this.getUserById(String(identifier)),
      email: async () => this.getUserByEmail(String(identifier)),
    };

    return await GetRecord[identifierType]();
  }

  async updateUser(userId: string, updatedUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new CustomHttpException(SYS_MSG.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    Object.assign(user, updatedUserDto);
    await user.save();
    return {
      message: SYS_MSG.RESOURCE_UPDATED('User'),
      data: user,
    };
  }

  async softDeleteUser(userId: string) {
    const user = await this.userModel.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userModel.findByIdAndUpdate(userId, { isDeleted: true });

    return {
      status: 'success',
      message: 'Deletion in progress',
    };
  }
}
