import { UserRole } from '@domain/user/entities/user';

export type UserDocument = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};
