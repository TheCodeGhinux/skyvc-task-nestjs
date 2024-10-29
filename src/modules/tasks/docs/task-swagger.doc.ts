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
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskBadRequestResponseDto, TaskForbiddenResponseDto, TaskNotFoundResponseDto, TaskPermissionResponseDto, TaskResponseDto } from '../dto/task-response.dto';
import { LoginErrorResponseDto } from '../../auth/dto/login-error-dto';
import { UpdateTaskDto } from '../dto/update-Task.dto';

export function CreateTaskDoc() {
  return applyDecorators(
    ApiTags('Tasks'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new Task' }),
    ApiBody({
      description: 'Create Task body',
      type: CreateTaskDto,
    }),
    ApiResponse({ status: 200, description: 'Task created successfully', type: TaskResponseDto }),
    ApiUnauthorizedResponse({ description: 'Invalid credentials', type: LoginErrorResponseDto })
  );
}

export function GetTaskByIdDoc() {
  return applyDecorators(
    ApiTags('Tasks'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a Task by id' }),
    ApiResponse({ status: 200, description: 'Task fetched successfully', type: TaskResponseDto }),
    ApiUnauthorizedResponse({ status: 401, description: 'Login Error', type: TaskPermissionResponseDto }),
    ApiForbiddenResponse({ status: 403, description: 'Permission Error', type: TaskForbiddenResponseDto }),
    ApiBadRequestResponse({status: 400, description: "Invalid id", type: TaskBadRequestResponseDto }),
    ApiNotFoundResponse({status: 404, description: "Not Found Error", type: TaskNotFoundResponseDto })
  );
}

export function UpdateTaskDoc() {
  return applyDecorators(
    ApiTags('Tasks'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a Task' }),
    ApiBody({
      description: 'Update Task body',
      type: UpdateTaskDto,
    }),
    ApiResponse({ status: 200, description: 'Task updated successfully', type: TaskResponseDto }),
    ApiUnauthorizedResponse({ status: 401, description: 'Login Error', type: TaskPermissionResponseDto }),
    ApiForbiddenResponse({ status: 403, description: 'Permission Error', type: TaskForbiddenResponseDto }),
    ApiBadRequestResponse({status: 400, description: "Invalid id", type: TaskBadRequestResponseDto }),
    ApiNotFoundResponse({status: 404, description: "Not Found Error", type: TaskNotFoundResponseDto })
  );
}

export function GetAllTaskByDoc() {
  return applyDecorators(
    ApiTags('Tasks'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all Tasks' }),
    // ApiParam({})
    ApiResponse({ status: 200, description: 'Tasks fetched successfully', type: [TaskResponseDto] }),
    ApiUnauthorizedResponse({ status: 401, description: 'Login Error', type: TaskPermissionResponseDto }),
    ApiForbiddenResponse({ status: 403, description: 'Permission Error', type: TaskForbiddenResponseDto }),
  );
}


export function DeleteTaskDoc() {
  return applyDecorators(
    ApiTags('Tasks'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a Task' }),
    ApiResponse({ status: 200, description: 'Task deleted successfully' }),
    ApiUnauthorizedResponse({ status: 401, description: 'Login Error', type: TaskPermissionResponseDto }),
    ApiForbiddenResponse({ status: 403, description: 'Permission Error', type: TaskForbiddenResponseDto }),
    ApiBadRequestResponse({ status: 400, description: 'Invalid Task ID', type: TaskBadRequestResponseDto }),
    ApiNotFoundResponse({ status: 404, description: 'Task not found', type: TaskNotFoundResponseDto }),
  );
}