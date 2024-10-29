import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { ProjectsService } from '../../projects/projects.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { CustomHttpException } from '../../../helpers/custom-http-filter';
import { TaskStatus } from '../entities/task.schema';

describe('TasksService', () => {
  let tasksService: TasksService;
  let projectsService: ProjectsService;

  const mockProject: any = {
    id: 'projectId',
    owner: 'ownerId',
    tasks: [],
    save: jest.fn(),
  };

  const mockTaskModel = jest.fn();
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: ProjectsService,
          useValue: {
            getProjectById: jest.fn(),
          },
        },
        {
          provide: 'TaskModel',
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });
 
  it('should create a task successfully', async () => {
    const createTaskDto = {
      title: 'Test Task',
      status: TaskStatus.PENDING,
      due_date: "2023-09-20",
    };
  
    jest.spyOn(projectsService, 'getProjectById').mockResolvedValue(mockProject);
  
    // Create a new instance of the task model and set properties
    const mockTask = {
      ...createTaskDto,
      _id: 'taskId',
      owner: mockProject.owner,
      project: mockProject.id,
      save: jest.fn().mockResolvedValue(true),
    };
  
    // Set the mock task model to return this task instance
    mockTaskModel.mockImplementation(() => mockTask);
  
    const result = await tasksService.createTask(createTaskDto, 'projectId');
  
    expect(result).toEqual({
      message: 'Task created successfully',
      data: mockTask,
    });
    expect(mockProject.tasks).toContain(mockTask._id); // Check the task ID
    expect(mockProject.save).toHaveBeenCalled(); // Ensure save was called
  });
  


  it('should throw an error if the project is not found', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Task Description',
      status: TaskStatus.PENDING,
      due_date: "2023-09-20",
    };

    jest.spyOn(projectsService, 'getProjectById').mockResolvedValue(null);

    await expect(tasksService.createTask(createTaskDto, 'invalidId')).rejects.toThrow(
      new CustomHttpException('Task not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw an error if task creation fails', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Task Description',
      status: TaskStatus.PENDING,
      due_date: "2023-09-20",
    };

    jest.spyOn(projectsService, 'getProjectById').mockResolvedValue(mockProject);

    // Ensure the mockTaskModel throws an error when save is called
    const mockTask = new mockTaskModel();
    mockTask.save = jest.fn().mockImplementation(() => { throw new Error('Failed to create Task'); });
    
    mockTaskModel.mockImplementation(() => mockTask);

    await expect(tasksService.createTask(createTaskDto, 'projectId')).rejects.toThrow(
      new CustomHttpException('Failed to create Task', HttpStatus.BAD_REQUEST),
    );
  });
});
