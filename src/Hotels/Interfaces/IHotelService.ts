import { typeId } from '../../Users/Interfaces/param-id';

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: typeId): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}