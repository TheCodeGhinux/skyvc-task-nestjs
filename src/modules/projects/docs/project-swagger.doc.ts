import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectBadRequestResponseDto, ProjectForbiddenResponseDto, ProjectNotFoundResponseDto, ProjectPermissionResponseDto, ProjectResponseDto } from '../dto/project-response.dto';
import { LoginErrorResponseDto } from '@/modules/auth/dto/login-error-dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

export function CreatePrjectDoc() {
  return applyDecorators(
    ApiTags('Projects'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new project' }),
    ApiBody({
      description: 'Create project body',
      type: CreateProjectDto,
    }),
    ApiResponse({ status: 200, description: 'Project created successfully', type: ProjectResponseDto }),
    ApiUnauthorizedResponse({ description: 'Invalid credentials', type: LoginErrorResponseDto })
  );
}

export function GetPrjectByIdDoc() {
  return applyDecorators(
    ApiTags('Projects'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a project by id' }),
    ApiResponse({ status: 200, description: 'Project fetched successfully', type: ProjectResponseDto }),
    ApiUnauthorizedResponse({ status: 401, description: 'Login Error', type: ProjectPermissionResponseDto }),
    ApiForbiddenResponse({ status: 403, description: 'Permission Error', type: ProjectForbiddenResponseDto }),
    ApiBadRequestResponse({status: 400, description: "Invalid id", type: ProjectBadRequestResponseDto }),
    ApiNotFoundResponse({status: 404, description: "Not Found Error", type: ProjectNotFoundResponseDto })
  );
}

export function UpdateProjectDoc() {
  return applyDecorators(
    ApiTags('Projects'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a project' }),
    ApiBody({
      description: 'Update project body',
      type: UpdateProjectDto,
    }),
    ApiResponse({ status: 200, description: 'Project updated successfully', type: ProjectResponseDto }),
    ApiUnauthorizedResponse({ status: 401, description: 'Login Error', type: ProjectPermissionResponseDto }),
    ApiForbiddenResponse({ status: 403, description: 'Permission Error', type: ProjectForbiddenResponseDto }),
    ApiBadRequestResponse({status: 400, description: "Invalid id", type: ProjectBadRequestResponseDto }),
    ApiNotFoundResponse({status: 404, description: "Not Found Error", type: ProjectNotFoundResponseDto })
  );
}

export function GetAllPrjectByDoc() {
  return applyDecorators(
    ApiTags('Projects'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all projects' }),
    // ApiParam({})
    ApiResponse({ status: 200, description: 'Projects fetched successfully', type: [ProjectResponseDto] }),
    ApiUnauthorizedResponse({ status: 401, description: 'Login Error', type: ProjectPermissionResponseDto }),
    ApiForbiddenResponse({ status: 403, description: 'Permission Error', type: ProjectForbiddenResponseDto }),
  );
}
