import { Injectable, OnModuleInit } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private mongoose: Mongoose;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get<string>('server.mongo_uri');

    await this.connect(uri);
  }

  async connect(uri: string) {
    if (!this.mongoose) {
      this.mongoose = new Mongoose();
    }

    try {
      await this.mongoose.connect(uri);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }
}
