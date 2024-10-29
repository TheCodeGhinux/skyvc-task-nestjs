import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { TaskStatus } from "../entities/task.schema";

export class CreateTaskDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Project 1',
  })
  @IsString()
  @IsNotEmpty({message: "Please provide a task title"})
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
  @IsEnum(TaskStatus, { message: "Status must be one of the following: 'pending', 'in_progress', 'completed'." })
  @IsNotEmpty({message: "Please provide a valid task status"})
  status?: TaskStatus;
  
  @ApiProperty({
    description: 'The due date of the Task',
    example: '2024-10-29',
  })
  @IsString()
  @IsNotEmpty({message: "Please provide a due date"})
  due_date?: string;
}
