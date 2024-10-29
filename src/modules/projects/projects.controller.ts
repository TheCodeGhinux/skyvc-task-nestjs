import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { skipAuth } from '@/helpers/skipAuth';
import { AdminGuard } from '@/guards/admin.guard';
import { ProjectOwnerGuard } from '@/guards/projectOwner.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    const user = req.user
    return this.projectsService.createProject(createProjectDto, user);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // @UseGuards(ProjectOwnerGuard)
  @Get(':id')
  async findProductById(@Param('id') id: string) {
    return this.projectsService.findProductById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
