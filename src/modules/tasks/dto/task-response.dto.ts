import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../entities/task.schema";

export class TaskResponseDto {

  @ApiProperty({
    description: 'ID of the task',
    example: '67206ca69701ebf81a594445',
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    description: 'The title of the Task',
    example: 'Task 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the Task',
    example: 'Task 1 description',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The status of the Task',
    example: 'pending',
  })
  @IsString()
  status?: TaskStatus;

  @ApiProperty({
    description: 'The id of the parent project',
    example: '67206ca69701ebf81a594445',
  })
  @IsString()
  project: string;
  
  @ApiProperty({
    description: 'The due date of the Task',
    example: '2024-10-29',
  })
  @IsString()
  due_date?: string;

  @ApiProperty({
    description: 'The date Task was created',
    example: '2024-10-29T05:58:34.382Z',
  })
  @IsString()
  created_at?: string;

  @ApiProperty({
    description: 'The date Task was updated',
    example: '2024-10-29T05:58:34.382Z',
  })
  @IsString()
  updated_at?: string;

  @ApiProperty({
    description: 'Status of the task deletion',
    example: 'false',
  })
  @IsString()
  is_deleted?: boolean;

  @ApiProperty({
    description: 'The date Task was updated',
    example: '2024-10-29T05:58:34.382Z',
  })
  @IsString()
  deleted_at?: string;
}

export class TaskPermissionResponseDto {
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

export class TaskForbiddenResponseDto {
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

export class TaskBadRequestResponseDto {
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

export class TaskNotFoundResponseDto {
  @ApiProperty({
    description: 'Error message providing details about failed request',
    example: 'Task not found'
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code indicating the type of error',
    example: 404,
  })
  status_code: number;
}

