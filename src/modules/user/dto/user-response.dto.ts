import { ApiProperty } from '@nestjs/swagger';
import UserInterface from '@user/interfaces/UserInterface';

class UserData {
  @ApiProperty({
    description: 'The username of the user',
    example: 'John',
  })
  username: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'The date and time when the user was created',
    example: '2023-09-01T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The date and time when the user was last updated',
    example: '2023-09-01T12:00:00Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'The date and time when the user was deleted',
    example: '2023-09-01T12:00:00Z',
  })
  deleted_at: Date;
}
export class UserResponseDto {
  @ApiProperty({
    description: 'Status message of the user response',
    example: 'User found successful',
  })
  message: string;

  @ApiProperty({
    description: 'Data object containing user information and other relevant data',
    type: UserData,
  })
  data: UserData;
}

class ErrorCreateUserResponse {
  status_code: number;
  message: string;
}

class SuccessCreateUserResponse {
  status_code: number;
  message: string;
  data: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
      created_at: Date;
    };
  };
}
class RequestVerificationToken {
  email: string;
}

export { ErrorCreateUserResponse, SuccessCreateUserResponse, RequestVerificationToken };

type UserResponseDTO = Partial<UserInterface>;
export default UserResponseDTO;
