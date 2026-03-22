import { Post, IPostRepository } from '@domain/post';
import { ListPostsDto } from '@application/post/dto/post.dto';

export class ListPosts {
  constructor(private postRepository: IPostRepository) {}

  async execute(
    input: ListPostsDto
  ): Promise<{ posts: Post[]; total: number }> {
    return await this.postRepository.findAllPaginated(input);
  }
}
