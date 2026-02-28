import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { typeId } from 'src/Users/Interfaces/param-id';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  id: typeId;

  @Prop({ required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  sentAt: Date;

  @Prop({ required: true })
  text: string;

  @Prop()
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
