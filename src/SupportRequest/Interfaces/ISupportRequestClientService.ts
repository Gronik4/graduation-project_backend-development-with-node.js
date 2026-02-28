import { typeId } from 'src/Users/Interfaces/param-id';
import { CreateSupportRequestDto } from './dto/CreateSupportRequestDto';
import { MarkMessagesAsReadDto } from './dto/MarkMessagesAsReadDto';
import { SupportRequest } from '../schemas/supportRequest.schema';

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: typeId): Promise<number>;
}
