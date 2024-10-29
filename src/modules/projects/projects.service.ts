import { HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './entities/project.schema';
import * as SYS_MSG from '../../constant/SystemMessages';
import { CustomHttpException } from '../../helpers/custom-http-filter';
import { User } from '../user/entities/user.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  async createProject(createProjectDto: CreateProjectDto, user: any) {
    const newProject = new this.projectModel(createProjectDto);
    if (!newProject) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_FAILED('Creating new project'), HttpStatus.BAD_REQUEST);
    }
    newProject.owner = user.id;

    await newProject.save();
    return {
      message: SYS_MSG.RESOURCE_FOUND('Projects'),
      data: newProject,
    };
  }

  async findAllProject() {
    const projects = await this.projectModel
      .find({ is_deleted: false })
      .populate({ path: 'tasks', select: 'title description status due_date created_at', strictPopulate: false })
      .exec();

    return {
      message: SYS_MSG.RESOURCE_FOUND('Projects'),
      data: projects,
    };
  }

  async findProductById(id: string) {
    const project = await this.getProjectById(id);

    if (!project) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Project'), HttpStatus.NOT_FOUND);
    }
    return {
      message: SYS_MSG.RESOURCE_FOUND('Project'),
      data: project,
    };
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.getProjectById(id);
    if (!project) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Project'), HttpStatus.NOT_FOUND);
    }

    const updatedProject = await this.projectModel.findOneAndUpdate(
      { _id: id },
      { $set: updateProjectDto },
      { new: true }
    );
    if (!updatedProject) {
      throw new CustomHttpException(SYS_MSG.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
    return {
      message: SYS_MSG.RESOURCE_UPDATED('Project'),
      data: updatedProject,
    };
  }

  async deleteProject(id: string) {
    const project = await this.getProjectById(id);
    if (!project) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND('Project'), HttpStatus.NOT_FOUND);
    }
    const updatedProject = await this.projectModel.findByIdAndUpdate(
      id,
      { is_deleted: true, deleted_at: new Date() },
      { new: true }
    );

    return {
      message: SYS_MSG.RESOURCE_DELETED('Project'),
      data: updatedProject,
    };
  }

  async getProjectById(id: string) {
    const project = await this.projectModel
      .findOne({ _id: id, is_deleted: false })
      .populate({ path: 'tasks', select: 'title description status due_date created_at', strictPopulate: false })
      .exec();
    return project;
  }
}
