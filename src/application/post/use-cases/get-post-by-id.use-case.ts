import { Post, IPostRepository, PostId } from '@domain/post';
import { GetPostByIdDto } from '@application/post/dto/post.dto';
import { PostError } from '@shared/errors/post/post-error';

export class GetPostById {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: GetPostByIdDto): Promise<Post> {
    const postId = PostId.create(input.id);
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw PostError.postNotFound(postId.toString());
    }

    return post;
  }
}
