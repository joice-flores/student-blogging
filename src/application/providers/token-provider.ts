export interface TokenPayload {
  sub: string;
  email: string;
}

export interface TokenProvider {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
