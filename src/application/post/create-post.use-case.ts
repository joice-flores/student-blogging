import { Post, IPostRepository } from '@domain/post';

export interface CreatePostRequest {
  title: string;
  content: string;
  author: string;
}

export class CreatePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(request: CreatePostRequest): Promise<Post> {
    const post = new Post({
      title: request.title,
      content: request.content,
      author: request.author
    });

    await this.postRepository.create(post);

    return post;
  }
}
