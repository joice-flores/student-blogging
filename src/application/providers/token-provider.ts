import { RoleValue } from '@domain/user';

export interface TokenPayload {
  sub: string;
  email: string;
  role: RoleValue;
}

export interface TokenProvider {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
