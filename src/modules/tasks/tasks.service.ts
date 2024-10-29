import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as SYS_MSG from '../../constant/SystemMessages';
import { CustomHttpException } from '../../helpers/custom-http-filter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './entities/task.schema';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private projectsService: ProjectsService
  ) {}

  async createTask(createTaskDto: CreateTaskDto, projectId: string) {
    const project = await this.projectsService.getProjectById(projectId);
    if (!project) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Task'), HttpStatus.NOT_FOUND);
    }

    const newTask = new this.taskModel(createTaskDto);
    if (!newTask) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_FAILED('Creating new Task'), HttpStatus.BAD_REQUEST);
    }
    newTask.owner = project.owner;
    newTask.project = project.id;

    await newTask.save();

    project.tasks.push(newTask._id);
    await project.save();
    
    return {
      message: SYS_MSG.RESOURCE_CREATED('Task'),
      data: newTask,
    };
  }

  async findUserTasks(userId: string) {
    const tasks = await this.taskModel.find({ owner: userId, is_deleted: false }).populate('project').exec();

    return {
      message: SYS_MSG.RESOURCE_FOUND('Tasks'),
      data: tasks,
    };

  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  async getTaskById(id: string) {
    const task = await this.taskModel.findOne({ _id: id, is_deleted: false }).populate('project').exec();

    return task;
  }
}
