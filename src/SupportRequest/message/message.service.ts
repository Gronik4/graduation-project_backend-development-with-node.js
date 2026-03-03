import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '../schemas/message.schema';
import { Model } from 'mongoose';
import { CreateMessageDto } from '../Interfaces/dto/CreateMessageDto';
import { typeId } from 'src/Users/Interfaces/param-id';
import { UsersService } from 'src/Users/users.service';
import { ReplySendMessages } from '../Interfaces/ReplySendMessages';
import moment from 'moment';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private Message: Model<Message>,
    private readonly userSrv: UsersService,
  ) {}
  async createMessage(data: CreateMessageDto): Promise<Message> {
    const newMess = new this.Message(data);
    await newMess.save();
    return newMess;
  }

  async getMessage(messId: typeId): Promise<ReplySendMessages> {
    const message = await this.Message.findById(messId).select(
      'id sentAt text readAt author',
    );
    if (message) {
      const user = await this.userSrv.findById(message.author);
      const getMess: ReplySendMessages = {
        id: message.id,
        createdAt: moment(message.sentAt).format('D MMMM YYYY'),
        text: message.text,
        readAt: message.readAt ? moment(message.readAt).format('D MMMM YYYY') : '',
        author: {
          id: user?.id.toString(),
          name: user?.name,
        },
      };
      return getMess;
    } else {
      throw new HttpException('Ни одного сообщения не найдено!', 404);
    }
  }
}
