import { ListUsers } from '@application/user';
import { MongoUserRepository } from '@infrastructure/database/mongodb/repositories/mongo-user.repository';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

export function makeListUsers(): ListUsers {
  const userRepository = new MongoUserRepository(getDatabase());
  return new ListUsers(userRepository);
}
