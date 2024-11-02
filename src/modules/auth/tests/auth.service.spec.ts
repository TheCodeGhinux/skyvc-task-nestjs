import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import AuthenticationService from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as SYS_MSG from '../../../constant/SystemMessages';
import UserService from '../../user/user.service';
import { CustomHttpException } from '../../../helpers/custom-http-filter';
import { CreateUserDTO } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UserService,
          useValue: {
            getUserRecord: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'auth.hashSalt') return '10';
              if (key === 'auth.cookieExpiry') return 3600;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('createNewUser', () => {
    it('should throw an error if user already exists', async () => {
      jest.spyOn(userService, 'getUserRecord').mockResolvedValueOnce({});

      await expect(service.createNewUser({ email: 'test@example.com', password: 'password' } as CreateUserDTO))
        .rejects.toThrow(new CustomHttpException(SYS_MSG.USER_ACCOUNT_EXIST, HttpStatus.BAD_REQUEST));
    });

    it('should create a new user and return response payload', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' } as CreateUserDTO;
      const hashedPassword = 'hashedPassword'; // Simulated hashed password
      const user = { _id: 'userId', username: 'username', email: 'test@example.com', role: 'user' };

      // Mock userService and other dependencies
      jest.spyOn(userService, 'getUserRecord').mockResolvedValueOnce(null); 
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValueOnce(hashedPassword);  // Specify type
      jest.spyOn(userService, 'createUser').mockResolvedValueOnce(undefined); 
      jest.spyOn(userService, 'getUserRecord').mockResolvedValueOnce(user); 
      jest.spyOn(jwtService, 'sign').mockReturnValue('token'); 
      const result = await service.createNewUser(createUserDto);

      expect(result).toEqual({
        message: SYS_MSG.USER_CREATED_SUCCESSFULLY,
        access_token: 'token',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
      });
    });
  });

  describe('loginUser', () => {
    it('should throw an error if user does not exist', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };

      jest.spyOn(userService, 'getUserRecord').mockResolvedValueOnce(null);

      await expect(service.loginUser(loginDto, {} as any)).rejects.toThrowError(
        new CustomHttpException(SYS_MSG.WRONG_PASSWORD, HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw an error if password does not match', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'wrongPassword' };
      const user = { password: 'hashedPassword' };

      jest.spyOn(userService, 'getUserRecord').mockResolvedValueOnce(user);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValueOnce(false);
      await expect(service.loginUser(loginDto, {} as any)).rejects.toThrowError(
        new CustomHttpException(SYS_MSG.WRONG_PASSWORD, HttpStatus.UNAUTHORIZED),
      );
    });

    it('should log in a user and return access token and user data', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const user = { _id: 'userId', username: 'username', email: 'test@example.com', role: 'user', password: 'hashedPassword' };

      jest.spyOn(userService, 'getUserRecord').mockResolvedValueOnce(user);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('token');
      const res = { cookie: jest.fn() };

      const result = await service.loginUser(loginDto, res as any);

      expect(result).toEqual({
        message: SYS_MSG.LOGIN_SUCCESSFUL,
        access_token: 'token',
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
      expect(res.cookie).toHaveBeenCalledWith('access_token', 'token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
      });
    });
  });
});
