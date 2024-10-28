import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop()
  isDeletted: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
