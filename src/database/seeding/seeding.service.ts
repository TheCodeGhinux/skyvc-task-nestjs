import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedingService {
  // async seedDatabase() {
  //   const userRepository = this.dataSource.getRepository(User);
  //   try {
  //     const existingUsers = await userRepository.count();
  //     if (existingUsers > 0) {
  //       Logger.log('Database is already populated. Skipping seeding.');
  //       return;
  //     }
  //     const queryRunner = this.dataSource.createQueryRunner();
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();
  //     try {
  //       const u1 = userRepository.create({
  //         first_name: 'John',
  //         last_name: 'Smith',
  //         email: 'john.smith@example.com',
  //         password: 'password',
  //       });
  //       const u2 = userRepository.create({
  //         first_name: 'Jane',
  //         last_name: 'Smith',
  //         email: 'jane.smith@example.com',
  //         password: 'password',
  //       });
  //       await userRepository.save([u1, u2]);
  //       const savedUsers = await userRepository.find();
  //       if (savedUsers.length !== 2) {
  //         throw new Error('Failed to create all users');
  //       }
  //       await queryRunner.commitTransaction();
  //     } catch (error) {
  //       await queryRunner.rollbackTransaction();
  //       console.error('Seeding failed:', error.message);
  //     } finally {
  //       await queryRunner.release();
  //     }
  //   } catch (error) {
  //     console.error('Error while checking for existing data:', error.message);
  //   }
  // }
  // async getUsers(): Promise<User[]> {
  //   try {
  //     return this.dataSource.getRepository(User).find();
  //   } catch (error) {
  //     console.log('Error fetching users:', error);
  //     throw new BadRequestException('Error fetching users');
  //   }
  // }
}
