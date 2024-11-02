import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '@user/dto/update-user-dto';
import { UserResponseDto } from '../dto/user-response.dto';



export function GetUserDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiOperation({ summary: 'Get User by ID' }),
    ApiResponse({
      status: 200,
      description: 'User retrieved successfully',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    })
  );
}

export function GetUserByUsernameDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiOperation({ summary: 'Get User by Username' }),
    ApiResponse({
      status: 200,
      description: 'User retrieved successfully',
      type: UserResponseDto
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    })
  );
}

export function SoftDeleteUserDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Soft delete a user account' }),
    ApiResponse({ status: 204, description: 'Deletion in progress' }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' })
  );
}

export function UpdateUserDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiOperation({ summary: 'Update User' }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
      type: UpdateUserDto,
    })
  );
}
