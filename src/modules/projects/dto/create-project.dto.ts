import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Project 1',
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  description?: string;
  createdBy: string;
  updatedBy: string;
}
