import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Url extends Document {
  @Prop({ required: true })
  originalUrl!: string;

  @Prop({ required: true, unique: true })
  shortCode!: string;

  @Prop({ type: String, default: null })
  customAlias!: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ default: 0 })
  clicks!: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
