import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '../schemas/message.schema';
import { Model } from 'mongoose';
import { CreateMessageDto } from '../Interfaces/dto/CreateMessageDto';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private Message: Model<Message>) {}
  async createMessage(data: CreateMessageDto) {
    const newMess = new this.Message(data);
    await newMess.save();
    return newMess;
  }
}
