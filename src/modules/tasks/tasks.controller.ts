import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDoc, DeleteTaskDoc, GetAllTaskByDoc, GetTaskByIdDoc, UpdateTaskDoc } from './docs/task-swagger.doc';
import { ProjectOwnerGuard } from '@/guards/projectOwner.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @CreateTaskDoc()
  @UseGuards(ProjectOwnerGuard)
  @Post(':projectId/create')
  createTask(@Body() createTaskDto: CreateTaskDto, @Param('projectId') projectId: string) {
    return this.tasksService.createTask(createTaskDto, projectId);
  }

  @GetAllTaskByDoc()
  @Get()
  findAllTask() {
    return this.tasksService.findAll();
  }

  @GetAllTaskByDoc()
  @Get('user')
  findUserTasks(@Req() req) {
    const userId = req.user.id;
    return this.tasksService.findUserTasks(userId);
  }

  @GetTaskByIdDoc()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @UpdateTaskDoc()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @DeleteTaskDoc()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
