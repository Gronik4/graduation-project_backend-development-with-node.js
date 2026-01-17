import { typeId } from 'src/Users/Interfaces/param-id';
import { MarkMessagesAsReadDto } from './MarkMessagesAsReadDto';

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: typeId): Promise<number>;
  closeRequest(supportRequest: typeId): Promise<void>;
}
