import { AuthRegister } from '@application/auth';
import { getDatabase } from '@infrastructure/database/mongodb/connection';
import { MongoUserRepository } from '@infrastructure/database/mongodb/repositories/mongo-user.repository';
import { Argon2HashProvider } from '@infrastructure/providers/argon2-hash-provider';

export function makeAuthRegister() {
  const mongoUserRepository = new MongoUserRepository(getDatabase());
  const hashProvider = new Argon2HashProvider();
  return new AuthRegister(mongoUserRepository, hashProvider);
}
