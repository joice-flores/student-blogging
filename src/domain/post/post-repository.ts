import { Post } from '@domain/post/post';
import { PostId } from '@domain/post/value-objects/post-id';

export interface IPostRepository {
  create(post: Post): Promise<void>;
  findById(id: PostId): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  update(post: Post): Promise<Post | null>;
  delete(id: PostId): Promise<boolean>;
  search(keyword: string): Promise<Post[]>;
}
