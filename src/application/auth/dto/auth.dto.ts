import { RoleValue } from '@domain/user';

export type RegisterInputDTO = {
  name: string;
  email: string;
  password: string;
};

export type RegisterOutputDTO = {
  id: string;
  name: string;
  email: string;
  role: RoleValue;
  createdAt: Date;
};

export type LoginInputDTO = {
  email: string;
  password: string;
};

export type LoginOutputDTO = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: RoleValue;
  };
};
