import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../entities/task.schema";

export class CreateTaskDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Project 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'Project 1 description',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The status of the task',
    example: 'pending',
  })
  @IsString()
  status?: TaskStatus;
  
  @ApiProperty({
    description: 'The due date of the Task',
    example: '2024-10-29',
  })
  @IsString()
  due_date?: string;
}
