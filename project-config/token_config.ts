import * as dotenv from 'dotenv';
dotenv.config();

export const UserSecret = {
  TnSct: process.env.JWT_SECRET || 'noToken',
  SeSSSct: process.env.SESSION_SECRET,
};
