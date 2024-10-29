import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from '../projects.service';
import { CustomHttpException } from '../../../helpers/custom-http-filter';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from '../entities/project.schema';
import * as SYS_MSG from '../../../constant/SystemMessages';
import { HttpStatus } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockProjectModel: any;

  beforeEach(async () => {
    mockProjectModel = jest.fn();

    const mockNewProject = {
      save: jest.fn(),
    };

    mockProjectModel.mockImplementation(() => mockNewProject);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getModelToken(Project.name),
          useValue: mockProjectModel,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      const createProjectDto = { name: 'Test Project', description: 'Test Description' };
      const user = { id: 'user-id' };

      const mockNewProject = {
        ...createProjectDto,
        owner: user.id,
        save: jest.fn().mockResolvedValue(true),
      };

      mockProjectModel.mockImplementation(() => mockNewProject);

      const result = await service.createProject(createProjectDto, user);

      expect(result).toEqual({
        message: SYS_MSG.RESOURCE_FOUND('Projects'),
        data: mockNewProject,
      });
      expect(mockProjectModel).toHaveBeenCalledWith(createProjectDto); 
      expect(mockNewProject.save).toHaveBeenCalled();
    });

    it('should throw an error if project creation fails', async () => {
      const createProjectDto = { name: 'Test Project' };
      const user = { id: 'user-id' };

      const mockNewProject = {
        ...createProjectDto,
        owner: user.id,
        save: jest.fn().mockRejectedValue(new Error('Creating new project failed')),
      };

      mockProjectModel.mockImplementation(() => mockNewProject);

      await expect(service.createProject(createProjectDto, user)).rejects.toThrow(
        new CustomHttpException(SYS_MSG.RESOURCE_FAILED('Creating new project'), HttpStatus.BAD_REQUEST)
      );
    });
  });
});
