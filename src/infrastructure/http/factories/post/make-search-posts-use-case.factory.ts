import { SearchPosts } from '@application/post';
import { MongoPostRepository } from '@infrastructure/database/mongodb/repositories/mongo-post.repository';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

export function makeSearchPosts(): SearchPosts {
  const mongoPostRepository = new MongoPostRepository(getDatabase());
  return new SearchPosts(mongoPostRepository);
}
