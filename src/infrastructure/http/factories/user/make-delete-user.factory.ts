import { DeleteUser } from '@application/user';
import { MongoUserRepository } from '@infrastructure/database/mongodb/repositories/mongo-user.repository';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

export function makeDeleteUser(): DeleteUser {
  const userRepository = new MongoUserRepository(getDatabase());
  return new DeleteUser(userRepository);
}
