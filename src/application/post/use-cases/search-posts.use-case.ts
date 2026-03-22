import { Post, IPostRepository } from '@domain/post';
import { SearchPostsDto } from '@application/post/dto/post.dto';

export class SearchPosts {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: SearchPostsDto): Promise<Post[]> {
    return await this.postRepository.search(input.query);
  }
}
