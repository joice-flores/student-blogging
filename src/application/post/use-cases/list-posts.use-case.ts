import { Post, IPostRepository } from '@domain/post';

export interface ListPostsRequest {
  limit?: number;
  skip?: number;
}

export class ListPosts {
  constructor(private postRepository: IPostRepository) {}

  async execute(request: ListPostsRequest): Promise<Post[]> {
    const posts = await this.postRepository.findAll();
    return posts;
  }
}
