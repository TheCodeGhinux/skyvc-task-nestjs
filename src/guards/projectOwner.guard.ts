import { CustomHttpException } from "@/helpers/custom-http-filter";
import { Injectable, CanActivate, ExecutionContext, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import * as SYS_MSG from "@constant/SystemMessages";
import { ProjectsService } from "@/modules/projects/projects.service";
import { AuthGuard } from "./auth.guard";
import UserService from "@/modules/user/user.service";
import { UserType } from "@/modules/user/entities/user.schema";

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private projectsService: ProjectsService,
    private userService: UserService,
    private authGuard: AuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.authGuard.extractTokenFromRequest(request);
    
    if (!token) {
      throw new CustomHttpException(SYS_MSG.UNAUTHENTICATED_MESSAGE, HttpStatus.UNAUTHORIZED);
    }

    const payload = request.user;
    const projectId = request.params.id || request.params.projectId;

    // Fetch project details to check ownership
    const project = await this.projectsService.getProjectById(projectId); 
    const projectOwner = await this.userService.getUserById(payload.id);

    if (!project) {
      throw new CustomHttpException(SYS_MSG.RESOURCE_NOT_FOUND("Project"), HttpStatus.NOT_FOUND)
    }
    
    if (projectOwner.role == UserType.ADMIN) {
      return true
    }

    if (!project || project.owner !== payload.id ) {
      throw new CustomHttpException(SYS_MSG.UNAUTHORIZED_MESSAGE, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
