import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ProjectResponseDto {

  @ApiProperty({
    description: 'ID of the prject',
    example: '67206ca69701ebf81a594445',
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: 'The name of the project',
    example: 'Project 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'Project 1 description',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: '67206ca69701ebf81a594445',
  })
  @IsString()
  owner: string;
  
  @ApiProperty({
    description: 'The date project was created',
    example: '2024-10-29T05:58:34.382Z',
  })
  @IsString()
  createdAt?: string;

  @ApiProperty({
    description: 'The date project was updated',
    example: '2024-10-29T05:58:34.382Z',
  })
  @IsString()
  updatedAt?: string;
}

export class ProjectPermissionResponseDto {
  @ApiProperty({
    description: 'Error message providing details about failed permission',
    example: 'User is currently unauthorized, kindly authenticate to continue',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code indicating the type of error',
    example: 401,
  })
  status_code: number;
}

export class ProjectForbiddenResponseDto {
  @ApiProperty({
    description: 'Error message providing details about failed permission',
    example: 'You do not have the permission to perform this action'
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code indicating the type of error',
    example: 403,
  })
  status_code: number;
}

export class ProjectBadRequestResponseDto {
  @ApiProperty({
    description: 'Error message providing details about failed request',
    example: 'Bad request'
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code indicating the type of error',
    example: 400,
  })
  status_code: number;
}

export class ProjectNotFoundResponseDto {
  @ApiProperty({
    description: 'Error message providing details about failed request',
    example: 'Project not found'
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code indicating the type of error',
    example: 404,
  })
  status_code: number;
}

