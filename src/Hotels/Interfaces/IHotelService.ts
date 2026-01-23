import { typeId } from '../../Users/Interfaces/param-id';
import { Hotel, HotelDocument } from '../Schemas/hotel.schema';
import { SearchHotelParams } from './SearchHotelParams';
import { UpdateHotelParams } from './UpdateHotelParams';

export interface IHotelService {
  create(data: any): Promise<Partial<HotelDocument> | null>;
  findById(id: typeId): Promise<Hotel | null>;
  search(params: SearchHotelParams): Promise<Hotel[] | null>;
  update(id: typeId, data: UpdateHotelParams): Promise<Hotel | null>;
}
