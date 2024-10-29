import { HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as SYS_MSG from '@constant/SystemMessages';
import { CustomHttpException } from '@/helpers/custom-http-filter';
import { Project } from './entities/project.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  async createProject(createProjectDto: CreateProjectDto, user) {
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
    const projects = await this.projectModel.find().exec();

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

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  async getProjectById(id: string) {
    const project = await this.projectModel.findOne({ _id: id }).exec();
    return project;
  }
}
