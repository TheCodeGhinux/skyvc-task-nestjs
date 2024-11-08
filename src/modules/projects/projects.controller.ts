import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { skipAuth } from '../../helpers/skipAuth';
import { AdminGuard } from '../../guards/admin.guard';
import { ProjectOwnerGuard } from '../../guards/projectOwner.guard';
import { CreatePrjectDoc, DeleteProjectDoc, GetAllPrjectByDoc, GetPrjectByIdDoc, UpdateProjectDoc } from './docs/project-swagger.doc';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @CreatePrjectDoc()
  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    const user = req.user
    return this.projectsService.createProject(createProjectDto, user);
  }

  @UseInterceptors(CacheInterceptor)
  @GetAllPrjectByDoc()
  @UseGuards(AdminGuard)
  @skipAuth()
  @Get()
  findAllProject() {
    return this.projectsService.findAllProject();
  }

  @UseInterceptors(CacheInterceptor)
  @GetPrjectByIdDoc()
  @UseGuards(ProjectOwnerGuard)
  @Get(':id')
  async findProductById(@Param('id') id: string) {
    return this.projectsService.findProductById(id);
  }

  @UpdateProjectDoc()
  @UseGuards(ProjectOwnerGuard)
  @Patch(':id')
  updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @DeleteProjectDoc()
  @UseGuards(ProjectOwnerGuard)
  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }
}
