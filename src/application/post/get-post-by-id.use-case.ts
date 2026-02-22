import { Post, IPostRepository, PostId } from '@domain/post';
import { PostError } from '@shared/errors/post/post-error';

export interface GetPostByIdRequest {
  id: string;
}

export class GetPostById {
  constructor(private postRepository: IPostRepository) {}

  async execute(request: GetPostByIdRequest): Promise<Post> {
    const postId = PostId.create(request.id);
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw PostError.postNotFound(postId.toString());
    }

    return post;
  }
}
