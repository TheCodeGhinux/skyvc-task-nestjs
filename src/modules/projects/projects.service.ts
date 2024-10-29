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
      throw new CustomHttpException(SYS_MSG.RESOURCE_FAILED("Creating new project"), HttpStatus.BAD_REQUEST)
    }
    newProject.owner = user.id

    await newProject.save();
    return {
      message: SYS_MSG.RESOURCE_FOUND('Projects'),
      data: newProject,
    };
  }

  async findAll() {
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
    console.log(project);
    return {
      message: SYS_MSG.RESOURCE_FOUND('Project'),
      data: project,
    };
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  async getProjectById(id: string) {
    const project = await this.projectModel.findOne({ _id: id }).exec();
    return project;
  }
}
