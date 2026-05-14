import { UserRole } from '@domain/user/entities/user';

export type RegisterInputDTO = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type RegisterOutputDTO = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
  };
};
