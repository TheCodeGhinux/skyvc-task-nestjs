import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: parseInt(process.env.PORT, 10) || 3008,
  mongo_uri: process.env.MONGO_URI
}));
