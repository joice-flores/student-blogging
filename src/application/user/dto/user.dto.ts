import { RoleValue } from '@domain/user';

export type CreateUserInputDTO = {
  name: string;
  email: string;
  password: string;
  role: RoleValue;
};

export type CreateUserOutputDTO = {
  id: string;
  name: string;
  email: string;
  role: RoleValue;
  createdAt: Date;
};
