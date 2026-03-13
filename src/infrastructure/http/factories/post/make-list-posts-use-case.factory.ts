import { ListPosts } from '@application/post';
import { MongoPostRepository } from '@infrastructure/database/mongodb/repositories/mongo-post.repository';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

export function makeListPosts(): ListPosts {
  const mongoPostRepository = new MongoPostRepository(getDatabase());
  return new ListPosts(mongoPostRepository);
}
