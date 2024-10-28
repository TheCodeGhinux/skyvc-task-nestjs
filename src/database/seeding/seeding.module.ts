import { Module } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { SeedingController } from './seeding.controller';
import { DatabaseModule } from '../database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@/modules/user/entities/user.schema';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '@user/entities/user.entity';

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [SeedingService],
  controllers: [SeedingController],
})
export class SeedingModule {}
