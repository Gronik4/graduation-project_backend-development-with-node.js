import { typeId } from 'src/Users/Interfaces/param-id';
import { GetChatListParams } from './GetChatListParams';
import { SendMessageDto } from './SendMessageDto';
import { SupportRequest } from '../schemas/supportRequest.schema';

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: typeId): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}
