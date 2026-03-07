import { typeId } from 'src/Users/Interfaces/param-id';
import { CreateSupportRequestDto } from './dto/CreateSupportRequestDto';
import { MarkMessagesAsReadDto } from './dto/MarkMessagesAsReadDto';
import { ReplyMessageClient } from './ReplyMessageClient';

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<ReplyMessageClient>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: typeId): Promise<number>;
}
/**
 * 1. Метод ISupportRequestClientService.getUnreadCount должен возвращать количество сообщений, которые были отправлены любым сотрудником поддержки и не отмечены прочитанным.
   2. Метод ISupportRequestClientService.markMessagesAsRead должен выставлять текущую дату в поле readAt всем сообщениям, которые не были прочитаны и были отправлены
     не пользователем.
 */
