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

export interface GetUserByIdInputDTO {
  id: string;
}

export interface UserOutputDTO {
  id: string;
  name: string;
  email: string;
  role: RoleValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserInputDTO {
  id: string;
  requesterId: string;
  requesterRole: RoleValue;
  name?: string;
  role?: RoleValue;
}

export interface DeleteUserInputDTO {
  id: string;
  requesterId: string;
  requesterRole: RoleValue;
}
