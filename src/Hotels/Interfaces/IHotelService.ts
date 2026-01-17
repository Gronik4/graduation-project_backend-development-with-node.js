import { typeId } from '../../Users/Interfaces/param-id';
import { Hotel } from '../Schemas/hotel.schema';
import { SearchHotelParams } from './SearchHotelParams';
import { UpdateHotelParams } from './UpdateHotelParams';

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: typeId): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: typeId, data: UpdateHotelParams): Promise<Hotel>;
}
