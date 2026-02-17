export interface UserFilters {
  email?: { $regex: string; $options: string };
  name?: { $regex: string; $options: string };
  contactPhone?: { $regex: string };
}
