import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { LoginErrorResponseDto } from '@auth/dto/login-error-dto';
import { LoginResponseDto } from '@auth/dto/login-response.dto';
import { LoginDto } from '@auth/dto/login.dto';
import {
  SuccessCreateUserResponse,
  ErrorCreateUserResponse,
  RequestVerificationToken,
} from '@user/dto/user-response.dto';
import { AuthResponseDto } from '@auth/dto/auth-response.dto';
import { CustomHttpException } from '@helpers/custom-http-filter';
import { GenericAuthResponseDto } from '@auth/dto/generic-reponse.dto';
import { ChangePasswordDto } from '@auth/dto/change-password.dto';

export function LoginUserDocs() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'Login a user' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto }),
    ApiUnauthorizedResponse({ description: 'Invalid credentials', type: LoginErrorResponseDto })
  );
}

export function RequestVerificationTokenDocs() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiBody({
      description: 'Request authentication token',
      type: RequestVerificationToken,
    }),
    ApiOperation({ summary: 'Request Verification Token' }),
    ApiResponse({ status: 200, description: 'Verification Token sent to mail', type: GenericAuthResponseDto }),
    ApiResponse({ status: 400, description: 'Bad request', type: CustomHttpException })
  );
}

export function ChangePasswordDocs() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiBearerAuth(),
    ApiBody({ type: ChangePasswordDto }),
    ApiOperation({ summary: 'Change user password' }),
    ApiResponse({ status: 200, description: 'Password changed successfully' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' })
  );
}

export function RegisterUserDocs() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'User Registration' }),
    ApiResponse({ status: 201, description: 'Register a new user', type: SuccessCreateUserResponse }),
    ApiResponse({ status: 400, description: 'User already exists', type: ErrorCreateUserResponse })
  );
}
