import { DeletePost } from '@application/post';
import { MongoPostRepository } from '@infrastructure/database/mongodb/mongo-post-repository';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

export function makeDeletePost(): DeletePost {
  const mongoPostRepository = new MongoPostRepository(getDatabase());
  return new DeletePost(mongoPostRepository);
}
