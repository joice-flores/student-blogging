import { GetPostById } from '@application/post';
import { MongoPostRepository } from '@infrastructure/database/mongodb/repositories/mongo-post.repository';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

export function makeGetPostById(): GetPostById {
  const mongoPostRepository = new MongoPostRepository(getDatabase());
  return new GetPostById(mongoPostRepository);
}
