export interface ReservationFilters {
  userId?: { $regex: string };
  dateStart?: { $eq: Date };
  dateEnd?: { $eq: Date };
}
