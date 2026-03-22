import { IPostRepository, PostId } from '@domain/post';
import { DeletePostDto } from '@application/post/dto/post.dto';
import { PostError } from '@shared/errors/post/post-error';

export class DeletePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: DeletePostDto): Promise<boolean> {
    const postId = PostId.create(input.id);
    const result = await this.postRepository.delete(postId);

    if (!result) {
      throw PostError.postNotFound(postId.toString());
    }

    return result;
  }
}
