import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { typeId } from 'src/Users/Interfaces/param-id';
import { Message } from './message.schema';

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class SupportRequest {
  @Prop({ required: true })
  user: typeId;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  messages: Message[];

  @Prop()
  isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
