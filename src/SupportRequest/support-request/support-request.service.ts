/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SupportRequest } from '../schemas/supportRequest.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SendMessageDto } from '../Interfaces/dto/SendMessageDto';
import { MessageService } from '../message/message.service';
import { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';
import moment from 'moment';
import 'moment/locale/ru';
import { GetChatListParams } from '../Interfaces/GetChatListParams';
import { UsersService } from 'src/Users/users.service';
import { ReplyMessageManager } from '../Interfaces/ReplyMessageManager';
import { ReplySendMessages } from '../Interfaces/ReplySendMessages';

@Injectable()
export class SupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name) private SupRequest: Model<SupportRequestService>,
    private readonly messSrv: MessageService,
    private readonly userSrv: UsersService,
  ) {}
  async sendMessage(data: SendMessageDto): Promise<ReplyMessageClient> {
    if (!data) throw new HttpException('Данные в sendMessage не переданы', 400);
    const messData = {
      author: data.author,
      text: data.text,
    };
    try {
      const mess = await this.messSrv.createMessage(messData);
      const newDataTicket = { user: data.author, messages: [mess.id] };
      const newTicket = new this.SupRequest(newDataTicket);
      await newTicket.save();
      return this.outputOnceAnswer(newTicket as unknown as SupportRequest, 'on');
    } catch (err) {
      throw err;
    }
  }

  async findSupportRequests(
    params: GetChatListParams,
    userid?: string,
  ): Promise<ReplyMessageClient[] | ReplyMessageManager[] | undefined> {
    if (userid) {
      const listCli: ReplyMessageClient[] = [];
      const findReq = await this.SupRequest.find({
        user: userid,
        isActive: params.isActive,
      })
        .select('-__v')
        .exec();
      findReq.forEach((item) => {
        const outItem = this.outputOnceAnswer(item as unknown as SupportRequest, 'on');
        listCli.push(outItem);
      });
      return listCli;
    }

    const listMan: ReplyMessageManager[] = [];
    const findReq = await this.SupRequest.find({
      isActive: params.isActive,
    })
      .select('_id user createdAt isActive')
      .exec();
    for (let i = 0; i < findReq.length; i++) {
      const item = findReq[i];
      const supportItem = item as unknown as SupportRequest;
      const dataClient = await this.userSrv.findById(supportItem.user);
      const outEl: ReplyMessageManager = {
        id: item._id.toString(),
        isActive: supportItem.isActive,
        createdAt: moment(supportItem.createdAt).format('D MMMM YYYY'),
        hasNewMessages: true,
        client: {
          id: dataClient?.id.toString(),
          name: dataClient?.name,
          email: dataClient?.email,
          contactPhone: dataClient?.contactPhone,
        },
      };
      listMan.push(outEl);
    }
    return listMan;
  }

  async getMessages(messId: string, userId?: string): Promise<ReplySendMessages[]> {
    const outMess: ReplySendMessages[] = [];
    const sReq: SupportRequest | null = await this.SupRequest.findById(messId);
    if (!sReq) throw new HttpException(`Обращения с id: ${messId} не найдено.`, 404);
    if (userId != sReq.user)
      throw new HttpException('Пользователь не создал обращений.', 404);
    for (let i = 0; i < sReq.messages.length; i++) {
      const item = sReq.messages[i];
      const message = await this.messSrv.getMessage(item);
      outMess.push(message);
    }
    return outMess;
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
