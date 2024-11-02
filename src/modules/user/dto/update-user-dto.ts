import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  username?: string;

  // @ApiProperty({
  //   description: 'The username of the user',
  //   example: 'John',
  // })
  // @IsOptional()
  // @IsString()
  // role: string;
}
