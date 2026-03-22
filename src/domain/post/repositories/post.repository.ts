import { Post } from '@domain/post/entities/post';
import { PostId } from '@domain/post/value-objects/post-id';
import { ListPostsDto } from '@application/post/dto/post.dto';

export interface IPostRepository {
  create(post: Post): Promise<void>;
  findById(id: PostId): Promise<Post | null>;
  findAllPaginated(
    input: ListPostsDto
  ): Promise<{ posts: Post[]; total: number }>;
  update(post: Post): Promise<Post | null>;
  delete(id: PostId): Promise<boolean>;
  search(keyword: string): Promise<Post[]>;
}
