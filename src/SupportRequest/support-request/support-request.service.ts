/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
//import { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';
import { Model } from 'mongoose';
import { SupportRequest } from '../schemas/supportRequest.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SendMessageDto } from '../Interfaces/dto/SendMessageDto';
//import { typeId } from 'src/Users/Interfaces/param-id';
import { MessageService } from '../message/message.service';
import { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';
import moment from 'moment';
import 'moment/locale/ru';

@Injectable()
export class SupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name) private SupRequest: Model<SupportRequestService>,
    private readonly messSrv: MessageService,
  ) {}
  async sendMessage(data: SendMessageDto) {
    if (!data) throw new HttpException('Данные в sendMessage не переданы', 400);
    const messData = {
      author: data.author,
      text: data.text,
    };
    try {
      const mess = this.messSrv.createMessage(messData);
      const newDataTicket = { user: data.author, messages: [(await mess)._id] };
      const newTicket = new this.SupRequest(newDataTicket);
      await newTicket.save();
      return this.outputOnceAnswer(newTicket as unknown as SupportRequest, 'on');
    } catch (err) {
      throw err;
    }
  }

  outputOnceAnswer(data: SupportRequest, flag: string): ReplyMessageClient {
    const dateString = moment(data.createdAt).format('D MMMM YYYY');
    const hasNewMess = flag === 'on' ? true : false;
    const outData = {
      id: data.id,
      createdAt: dateString,
      isActive: data.isActive,
      hasNewMessages: hasNewMess,
    };
    return outData;
  }
}
