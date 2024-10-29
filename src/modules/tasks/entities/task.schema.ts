import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ enum: TaskStatus, required: true, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({ required: false })
  due_date?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ default: false, alias: 'is_deleted' })
  isDeleted: boolean;

  @Prop({ type: Date, alias: 'deleted_at' })
  deletedAt?: Date; 
}

export const TaskSchema = SchemaFactory.createForClass(Task);
