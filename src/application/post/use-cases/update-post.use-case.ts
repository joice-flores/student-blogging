import { Post, IPostRepository, PostId } from '@domain/post';
import { UpdatePostDto } from '@application/post/dto/post.dto';
import { PostError } from '@shared/errors/post/post-error';

export class UpdatePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: UpdatePostDto): Promise<Post> {
    const postId = PostId.create(input.id);
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw PostError.postNotFound(postId.toString());
    }

    if (input.title && input.content) {
      post.update(input.title, input.content);
    }

    const updatedPost = await this.postRepository.update(post);

    if (updatedPost === null) {
      throw PostError.postNotFound(postId.toString());
    }

    return updatedPost;
  }
}
