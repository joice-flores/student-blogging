import { TokenProvider } from '@application/providers/token-provider';
import { JwtTokenProvider } from '@infrastructure/providers/jwt-token-provider';
import { env } from '@shared/env';

export function makeTokenProvider(): TokenProvider {
  return new JwtTokenProvider(env.JWT_SECRET);
}
