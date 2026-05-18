import { RoleValue } from '@domain/user';

export type UserDocument = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: RoleValue;
  createdAt: Date;
  updatedAt: Date;
};
