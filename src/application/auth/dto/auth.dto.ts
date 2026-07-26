import { RoleValue } from '@domain/user';

export type RegisterInputDTO = {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role?: RoleValue;
};

export type RegisterOutputDTO = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: RoleValue;
  readonly createdAt: Date;
};

export type LoginInputDTO = {
  readonly email: string;
  readonly password: string;
};

export type LoginOutputDTO = {
  readonly accessToken: string;
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly role: RoleValue;
  };
};
