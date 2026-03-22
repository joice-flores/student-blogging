import { Login } from '@application/auth';
import { getDatabase } from '@infrastructure/database/mongodb/connection';
import { MongoUserRepository } from '@infrastructure/database/mongodb/repositories/mongo-user.repository';
import { Argon2HashProvider } from '@infrastructure/providers/argon2-hash-provider';
import { JwtTokenProvider } from '@infrastructure/providers/jwt-token-provider';
import { env } from '@shared/env';

export function makeLogin() {
  const mongoUserRepository = new MongoUserRepository(getDatabase());
  const hashProvider = new Argon2HashProvider();
  const tokenProvider = new JwtTokenProvider(env.JWT_SECRET);
  return new Login(mongoUserRepository, hashProvider, tokenProvider);
}
