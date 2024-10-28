import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('server.mongo_uri'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
