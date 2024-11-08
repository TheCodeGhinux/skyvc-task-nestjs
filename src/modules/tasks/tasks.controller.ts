import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDoc, DeleteTaskDoc, GetAllTaskByDoc, GetTaskByIdDoc, UpdateTaskDoc } from './docs/task-swagger.doc';
import { ProjectOwnerGuard } from '@/guards/projectOwner.guard';
import { AdminGuard } from '@/guards/admin.guard';
import { TaskOwnerGuard } from '@/guards/task-owner.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @CreateTaskDoc()
  @UseGuards(TaskOwnerGuard)
  @Post(':projectId/create')
  createTask(@Body() createTaskDto: CreateTaskDto, @Param('projectId') projectId: string) {
    return this.tasksService.createTask(createTaskDto, projectId);
  }

  @UseInterceptors(CacheInterceptor)
  @GetAllTaskByDoc()
  @UseGuards(AdminGuard)
  @Get()
  findAllTask() {
    return this.tasksService.findAllTask();
  }

  @UseInterceptors(CacheInterceptor)
  @GetAllTaskByDoc()
  @UseGuards(TaskOwnerGuard)
  @Get('user')
  findUserTasks(@Req() req) {
    const userId = req.user.id;
    return this.tasksService.findUserTasks(userId);
  }

  @UseInterceptors(CacheInterceptor)
  @GetTaskByIdDoc()
  @UseGuards(TaskOwnerGuard)
  @Get(':id')
  findTaskByID(@Param('id') id: string) {
    return this.tasksService.findTaskByID(id);
  }

  @UpdateTaskDoc()
  @UseGuards(TaskOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @DeleteTaskDoc()
  @UseGuards(TaskOwnerGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
