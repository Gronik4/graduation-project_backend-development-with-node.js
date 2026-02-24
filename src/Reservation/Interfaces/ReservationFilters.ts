export interface ReservationFilters {
  userId?: { $regex: string };
  dateStart?: { $regex: Date };
  dateEnd?: { $regex: Date };
}
