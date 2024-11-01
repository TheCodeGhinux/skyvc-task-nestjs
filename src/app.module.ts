import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import authConfig from '@config/auth.config';
import serverConfig from '@config/server.config';
import { SeedingModule } from '@db/seeding/seeding.module';
import { AuthGuard } from '@/guards/auth.guard';
import HealthController from '@/health.controller';
import { AuthModule } from '@auth/auth.module';

import { UserModule } from '@user/user.module';

import ProbeController from '@/probe.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';

import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [
    {
      provide: 'CONFIG',
      useClass: ConfigService,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    // {
    //   provide: 'ADMIN_GUARD',
    //   useClass: AdminGuard,
    // },
    // {
    //   provide: 'OWNER_GUARD',
    //   useClass: ProjectOwnerGuard,
    // },
  ],
  imports: [
    ConfigModule.forRoot({
      /*
       * By default, the package looks for a env file in the root directory of the application.
       * We don't use ".env" file because it is prioritize as the same level as real environment variables.
       * To specify multiple. env files, set the envFilePath property.
       * If a variable is found in multiple files, the first one takes precedence.
       */
      envFilePath: ['.env.development.local', `.env.${process.env.PROFILE}`],
      isGlobal: true,
      load: [serverConfig, authConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').required(),
        PROFILE: Joi.string().valid('local', 'development', 'production', 'ci', 'testing', 'staging').required(),
        PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    LoggerModule.forRoot(),
    SeedingModule,
    AuthModule,
    UserModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),

    ProjectsModule,

    TasksModule,
    CacheModule.register({ isGlobal: true })
  ],
  controllers: [HealthController, ProbeController],
})
export class AppModule {}
