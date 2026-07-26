import { RoleValue } from '@domain/user';

export type CreateUserInputDTO = {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: RoleValue;
};

export type CreateUserOutputDTO = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: RoleValue;
  readonly createdAt: Date;
};

export interface GetUserByIdInputDTO {
  readonly id: string;
}

export interface UserOutputDTO {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: RoleValue;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UpdateUserInputDTO {
  readonly id: string;
  readonly requesterId: string;
  readonly requesterRole: RoleValue;
  readonly name?: string;
  readonly role?: RoleValue;
}

export interface DeleteUserInputDTO {
  readonly id: string;
  readonly requesterId: string;
  readonly requesterRole: RoleValue;
}
