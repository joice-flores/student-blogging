import { CreatePost } from '@application/post';
import { MongoPostRepository } from '@infrastructure/database/mongodb/mongo-post-repository';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

export function makeCreatePost(): CreatePost {
  const mongoPostRepository = new MongoPostRepository(getDatabase());
  return new CreatePost(mongoPostRepository);
}
