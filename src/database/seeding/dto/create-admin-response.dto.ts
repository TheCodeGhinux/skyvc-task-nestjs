import { User } from '@/modules/user/entities/user.schema';

export class CreateAdminResponseDto {
  status: number;
  data: User;
  message: string;
}
