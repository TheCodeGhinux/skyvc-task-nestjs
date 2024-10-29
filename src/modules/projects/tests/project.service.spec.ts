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

    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    mockProjectModel = {
      find: jest.fn().mockReturnValue(mockQuery),
      findOne: jest.fn().mockReturnValue(mockQuery),
      findByIdAndUpdate: jest.fn(),
      save: jest.fn(),
      new: jest.fn(), 
      constructor: jest.fn(),
    };

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


  // describe('createProject', () => {
  //   it('should create a new project successfully', async () => {
  //     const createProjectDto = { name: 'Test Project', description: 'Test Description' };
  //     const user = { id: 'user-id' };


  //     const mockNewProject = {
  //       ...createProjectDto,
  //       owner: user.id,
  //       save: jest.fn().mockResolvedValue(true),
  //     };


  //     mockProjectModel.mockImplementation(() => mockNewProject);

  //     const result = await service.createProject(createProjectDto, user);

  //     expect(result).toEqual({
  //       message: SYS_MSG.RESOURCE_FOUND('Projects'),
  //       data: mockNewProject,
  //     });
  //     expect(mockProjectModel).toHaveBeenCalledWith(createProjectDto);
  //     expect(mockNewProject.save).toHaveBeenCalled();
  //   });

  //   it('should throw an error if project creation fails', async () => {
  //     const createProjectDto = { name: 'Test Project' };
  //     const user = { id: 'user-id' };

  //     // Simulate failure in the save method
  //     const mockNewProject = { ...createProjectDto, owner: user.id, save: jest.fn().mockRejectedValue(new Error('Save failed')) };
  //     mockProjectModel.constructor.mockImplementation(() => mockNewProject);

  //     await expect(service.createProject(createProjectDto, user)).rejects.toThrow(
  //       new CustomHttpException(SYS_MSG.RESOURCE_FAILED('Creating new project'), HttpStatus.BAD_REQUEST)
  //     );
  //   });
  // });


  describe('findAllProject', () => {
    it('should return all projects successfully', async () => {
      const mockProjects = [
        { _id: '1', name: 'Project 1', is_deleted: false },
        { _id: '2', name: 'Project 2', is_deleted: false },
      ];

      mockProjectModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockProjects),
        }),
      });

      const result = await service.findAllProject();

      expect(result).toEqual({
        message: SYS_MSG.RESOURCE_FOUND('Projects'),
        data: mockProjects,
      });
      expect(mockProjectModel.find).toHaveBeenCalledWith({ is_deleted: false });
    });
  });

  describe('findProductById', () => {
    it('should return a project by ID successfully', async () => {
      const mockProject = { _id: '1', name: 'Project 1', is_deleted: false, __v: 0  } as any;
      jest.spyOn(service, 'getProjectById').mockResolvedValue(mockProject);

      const result = await service.findProductById('1');

      expect(result).toEqual({
        message: SYS_MSG.RESOURCE_FOUND('Project'),
        data: mockProject,
      });
      expect(service.getProjectById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if project not found', async () => {
      jest.spyOn(service, 'getProjectById').mockResolvedValue(null);

      await expect(service.findProductById('invalid-id')).rejects.toThrow(
        new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Project'), HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('deleteProject', () => {
    it('should delete a project successfully', async () => {
      const mockProject = { _id: 'mock-id', name: 'Test Project', is_deleted: false };
      mockProjectModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProject),
      });
      
    });

    it('should throw an error if project not found', async () => {
      jest.spyOn(service, 'getProjectById').mockResolvedValue(null);

      await expect(service.deleteProject('invalid-id')).rejects.toThrow(
        new CustomHttpException('Project not found', 404)
      );
    });

    it('should throw an error if invalid ID is provided', async () => {
      await expect(service.deleteProject('')).rejects.toThrow(
        new CustomHttpException('Project not found', 400)
      );
    });
  });
});