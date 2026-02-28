import { typeId } from 'src/Users/Interfaces/param-id';

export interface SendMessageDto {
  author: typeId;
  supportRequest: typeId;
  text: string;
}
