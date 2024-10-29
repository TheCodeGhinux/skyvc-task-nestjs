import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectSchema } from './entities/project.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from '@/guards/auth.guard';
import { ProjectOwnerGuard } from '@/guards/projectOwner.guard';
import UserService from '../user/user.service';
import { UserSchema } from '../user/entities/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }, { name: 'User', schema: UserSchema }])],
  controllers: [ProjectsController],
  providers: [ProjectsService, AuthGuard, ProjectOwnerGuard, UserService],
})
export class ProjectsModule {}
