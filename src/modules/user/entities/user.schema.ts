import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop()
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
