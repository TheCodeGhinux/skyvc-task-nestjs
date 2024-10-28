import { string } from 'joi';
import { User } from '../../entities/user.schema';

export const mockUser: User = {
  username: 'Johnd',
  email: 'john@example.com',
  password: 'hashedpassword',
  created_at: new Date(),
  isDeleted: false,
};
