import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Project 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsString()
  description?: string;
}
