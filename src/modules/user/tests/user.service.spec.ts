import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomHttpException } from '../../../helpers/custom-http-filter';
import * as SYS_MSG from '../../../constant/SystemMessages';
import { HttpStatus } from '@nestjs/common';
import UserService from '../user.service';
import { User } from '../entities/user.schema';

const mockUser = {
  _id: 'someUserId',
  email: 'test@example.com',
  save: jest.fn().mockResolvedValue(this),
};

describe('UserService - updateUser', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should return user data if the user is found by Id', async () => {
    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(mockUser);

    const result = await service.findUserById('someUserId');

    expect(result).toEqual({
      message: SYS_MSG.RESOURCE_FOUND('User'),
      data: mockUser,
    });
    expect(userModel.findById).toHaveBeenCalledWith('someUserId');
  });

    it('should throw an error if the user is not found by Id', async () => {
    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

    await expect(service.findUserById('nonexistentUser')).rejects.toThrow(
      new CustomHttpException(SYS_MSG.USER_NOT_FOUND, HttpStatus.NOT_FOUND),
    );

    expect(userModel.findById).toHaveBeenCalledWith('nonexistentUser');
  });

  it('should return user data if the user is found', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser);

    const result = await service.getUserByUsername('testuser');

    expect(result).toEqual({
      message: SYS_MSG.RESOURCE_FOUND('User'),
      data: mockUser,
    });
    expect(userModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
  });

  it('should throw an error if the user is not found by username', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

    await expect(service.getUserByUsername('nonexistentUser')).rejects.toThrow(
      new CustomHttpException(SYS_MSG.USER_NOT_FOUND, HttpStatus.NOT_FOUND),
    );

    expect(userModel.findOne).toHaveBeenCalledWith({ username: 'nonexistentUser' });
  });

  it('should update the user successfully', async () => {
    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(mockUser);
    mockUser.save.mockResolvedValueOnce(mockUser);

    const result = await service.updateUser('someUserId', { email: 'updated@example.com' });

    expect(result).toEqual({
      message: SYS_MSG.RESOURCE_UPDATED('User'),
      data: mockUser,
    });
    expect(userModel.findById).toHaveBeenCalledWith('someUserId');
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('should throw an error if user is not found', async () => {
    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

    await expect(service.updateUser('invalidUserId', { email: 'updated@example.com' })).rejects.toThrow(
      new CustomHttpException(SYS_MSG.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    );

    expect(userModel.findById).toHaveBeenCalledWith('invalidUserId');
  });

  it('should soft delete the user if found and authorized', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser);
    jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce({ ...mockUser, isDeleted: true });

    const result = await service.softDeleteUser('userId');

    expect(result).toEqual({
      status: 'success',
      message: 'Deletion in progress',
    });
    expect(userModel.findOne).toHaveBeenCalledWith({ where: { id: 'userId' } });
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('userId', { isDeleted: true });
  });

  it('should throw an error if the user is not found', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

    await expect(service.softDeleteUser('invalidUserId')).rejects.toThrow(
      new CustomHttpException('User not found', HttpStatus.NOT_FOUND),
    );

    expect(userModel.findOne).toHaveBeenCalledWith({ where: { id: 'invalidUserId' } });
  });
});
