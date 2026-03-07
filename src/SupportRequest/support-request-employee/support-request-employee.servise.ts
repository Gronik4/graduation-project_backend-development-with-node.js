import { Injectable } from '@nestjs/common';
import { MarkMessagesAsReadDto } from '../Interfaces/dto/MarkMessagesAsReadDto';
//import { ISupportRequestEmployeeService } from '../Interfaces/ISupportRequestEmployeeService';

@Injectable()
export class SupportRequestEmployeeService /*implements ISupportRequestEmployeeService */ {
  markMessagesAsRead(params: MarkMessagesAsReadDto) {
    return params;
  }
}
