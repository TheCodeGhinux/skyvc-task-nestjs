import { InjectModel } from '@nestjs/mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as SYS_MSG from '../../constant/SystemMessages';
import { CustomHttpException } from '../../helpers/custom-http-filter';
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
      message: SYS_MSG.RESOURCE_FOUND("All user's tasks"),
      data: tasks,
    };

  }

  async findAllTask() {
    const tasks = await this.taskModel.find({ is_deleted: false }).populate({path: 'project', select: 'name description', strictPopulate: false}).exec();

    return {
      message: SYS_MSG.RESOURCE_FOUND('All tasks'),
      data: tasks,
    };
  }

  async findTaskByID(id: string) {
    const task = await this.getTaskById(id);

    if(!task) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Task'), HttpStatus.NOT_FOUND);
    }
    
    return {
      message: SYS_MSG.RESOURCE_FOUND('All tasks'),
      data: task,
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Task'), HttpStatus.NOT_FOUND);
    }

    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: id },
      { $set: updateTaskDto },
      { new: true }
    );
    if (!updatedTask) {
      throw new CustomHttpException(SYS_MSG.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
    return {
      message: SYS_MSG.RESOURCE_UPDATED('Task'),
      data: updatedTask,
    };
  }

  async deleteTask(id: string) {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Task'), HttpStatus.NOT_FOUND);
    }
    const updatedTask = await this.taskModel.findByIdAndUpdate(
      id,
      { is_deleted: true, deleted_at: new Date() },
      { new: true }
    );

    return {
      message: SYS_MSG.RESOURCE_DELETED('Task'),
      data: updatedTask,
    };
  }

  async getTaskById(id: string) {
    const task = await this.taskModel.findOne({ _id: id, is_deleted: false }).populate({path: 'project', select: 'name description'}).exec();

    return task;
  }

  async getProjectIdFromTask(taskId: string) {
    const task = await this.taskModel.findById(taskId).select('project');
  
    if (!task) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Task'), HttpStatus.NOT_FOUND);
    }
  
    return task.project;
  }
}
