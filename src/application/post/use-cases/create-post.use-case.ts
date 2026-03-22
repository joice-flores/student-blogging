import { Post, IPostRepository } from '@domain/post';
import { CreatePostDto } from '@application/post/dto/post.dto';

export class CreatePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: CreatePostDto): Promise<Post> {
    const post = new Post({
      title: input.title,
      content: input.content,
      author: input.author
    });

    await this.postRepository.create(post);

    return post;
  }
}
