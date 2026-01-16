import { typeId } from '../../Users/Interfaces/param-id';

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: typeId;
  isEnabled?: boolean | undefined;
}
