import jwt from 'jsonwebtoken';
import {
  TokenPayload,
  TokenProvider
} from '@application/providers/token-provider';

export class JwtTokenProvider implements TokenProvider {
  constructor(private readonly secret: string) {}

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '24h' });
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, this.secret) as TokenPayload;
  }
}
