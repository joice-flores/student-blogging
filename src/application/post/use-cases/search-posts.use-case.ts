import { Post, IPostRepository } from '@domain/post';

export interface SearchPostsRequest {
  query: string;
}

export class SearchPosts {
  constructor(private postRepository: IPostRepository) {}

  async execute(request: SearchPostsRequest): Promise<Post[]> {
    return await this.postRepository.search(request.query);
  }
}
