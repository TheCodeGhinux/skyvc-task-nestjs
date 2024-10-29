import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from '../tasks.service';
import { CustomHttpException } from '../../../helpers/custom-http-filter';
import { Task } from '../entities/task.schema';
import * as SYS_MSG from '../../../constant/SystemMessages';
import { ProjectsService } from '../../projects/projects.service';

describe('TasksService', () => {
  let service: TasksService;
  let mockTaskModel: any;
  let mockProjectModel: any;
  let projectsService: ProjectsService;
  let mockProjectsService: any;

  beforeEach(async () => {

    // Create a mock for the query object
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    mockProjectsService = {
      getProjectById: jest.fn().mockReturnValue(mockQuery),
    };

    // Mock the task model
    mockTaskModel = {
      find: jest.fn().mockReturnValue(mockQuery),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findOne: jest.fn().mockReturnValue(mockQuery),
    };

    mockProjectModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        ProjectsService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
        {
          provide: getModelToken('Project'),
          useValue: mockProjectModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    projectsService = module.get<ProjectsService>(ProjectsService);

    service.getTaskById = jest.fn(async (id: string) => {
      if (id === 'mock-task-id') {
        return {
          _id: id,
          is_deleted: false,
          title: 'Mock Task Title',
          description: 'Mock Task Description',
          __v: 0,
        } as any;
      }
      return null;
    });
  });

  describe('findUserTasks', () => {
    it('should return all tasks for a user', async () => {
      const mockTasks = [
        { _id: 'task1', owner: 'user1', is_deleted: false },
        { _id: 'task2', owner: 'user1', is_deleted: false },
      ];
      mockTaskModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockTasks),
        }),
      });

      const result = await service.findUserTasks('user1');

      expect(result).toEqual({
        message: SYS_MSG.RESOURCE_FOUND("All user's tasks"),
        data: mockTasks,
      });
      expect(mockTaskModel.find).toHaveBeenCalledWith({ owner: 'user1', is_deleted: false });
    });
  });

  // Tests for findAllTask
  describe('findAllTask', () => {
    it('should return all non-deleted tasks', async () => {
      const mockTasks = [
        { _id: 'task1', is_deleted: false },
        { _id: 'task2', is_deleted: false },
      ];
      mockTaskModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockTasks),
        }),
      });

      const result = await service.findAllTask();

      expect(result).toEqual({
        message: SYS_MSG.RESOURCE_FOUND('All tasks'),
        data: mockTasks,
      });
      expect(mockTaskModel.find).toHaveBeenCalledWith({ is_deleted: false });
    });
  });

  // Tests for findTaskByID
  describe('findTaskByID', () => {
    it('should return a task by ID', async () => {
      const mockTask = { _id: 'mock-task-id', is_deleted: false } as any;
      jest.spyOn(service, 'getTaskById').mockResolvedValue(mockTask);

      const result = await service.findTaskByID('mock-task-id');

      expect(result).toEqual({
        message: SYS_MSG.RESOURCE_FOUND('All tasks'),
        data: mockTask,
      });
      expect(service.getTaskById).toHaveBeenCalledWith('mock-task-id');
    });

    it('should throw an error if task not found', async () => {
      jest.spyOn(service, 'getTaskById').mockResolvedValue(null);

      await expect(service.findTaskByID('non-existent-id')).rejects.toThrow(
        new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Task'), HttpStatus.NOT_FOUND)
      );
    });
  });

  // Tests for deleteTask
  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const mockTask = { _id: 'mock-task-id', is_deleted: false };
      mockTaskModel.findById.mockResolvedValue(mockTask);
      mockTaskModel.findByIdAndUpdate.mockResolvedValue({ ...mockTask, is_deleted: true });

      const result = await service.deleteTask('mock-task-id');

      expect(result).toEqual({
        message: SYS_MSG.RESOURCE_DELETED('Task'),
        data: expect.objectContaining({ _id: 'mock-task-id', is_deleted: true }),
      });
      expect(mockTaskModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'mock-task-id',
        { is_deleted: true, deleted_at: expect.any(Date) },
        { new: true }
      );
    });

    it('should throw an error if task not found for deletion', async () => {
      mockTaskModel.findById.mockResolvedValue(null);

      await expect(service.deleteTask('non-existent-id')).rejects.toThrow(
        new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Task'), HttpStatus.NOT_FOUND)
      );
    });
  });
});
