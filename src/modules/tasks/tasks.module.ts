import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from '../projects/entities/project.schema';
import { ProjectsService } from '../projects/projects.service';
import { UserSchema } from '../user/entities/user.schema';
import { TaskSchema } from './entities/task.schema';
import { ProjectOwnerGuard } from '@/guards/projectOwner.guard';
import UserService from '../user/user.service';
import { AuthGuard } from '@/guards/auth.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }, { name: 'Project', schema: ProjectSchema }, { name: 'User', schema: UserSchema }])],
  controllers: [TasksController],
  providers: [TasksService, ProjectsService, AuthGuard, ProjectOwnerGuard, UserService],
})
export class TasksModule {}
