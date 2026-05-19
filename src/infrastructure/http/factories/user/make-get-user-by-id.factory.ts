import { GetUserById } from '@application/user';
import { MongoUserRepository } from '@infrastructure/database/mongodb/repositories/mongo-user.repository';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

export function makeGetUserById(): GetUserById {
  const userRepository = new MongoUserRepository(getDatabase());
  return new GetUserById(userRepository);
}
