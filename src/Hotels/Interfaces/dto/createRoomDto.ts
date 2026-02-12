import { Types } from 'mongoose';

export interface createRoomDto {
  hotel: Types.ObjectId;
  description: string;
  images: string[] | File[];
}
