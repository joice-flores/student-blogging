import { IPostRepository, PostId } from '@domain/post';
import { PostError } from '@shared/errors/post/post-error';

export interface DeletePostRequest {
  id: string;
}

export class DeletePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(request: DeletePostRequest): Promise<boolean> {
    const postId = PostId.create(request.id);
    const result = await this.postRepository.delete(postId);

    if (!result) {
      throw PostError.postNotFound(postId.toString());
    }

    return result;
  }
}
