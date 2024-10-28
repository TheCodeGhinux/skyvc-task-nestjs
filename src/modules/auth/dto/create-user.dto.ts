import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description:
      'The password for the user account.\
    It must contain at least one uppercase letter, one lowercase letter,\
    one number, and one special character.',
    example: 'P@ssw0rd!',
  })
  @MinLength(8)
  @IsNotEmpty()
  @IsStrongPassword(
    {},
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }
  )
  password: string;
}
