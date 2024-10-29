import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export type UserDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ enum: TaskStatus, required: true, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({ required: false })
  due_date?: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ default: false})
  is_deleted: boolean;

  @Prop({ type: Date})
  deleted_at?: Date; 
}

export const TaskSchema = SchemaFactory.createForClass(Task);
