import { Post, IPostRepository, PostId } from '@domain/post';
import { PostError } from '@shared/errors/post/post-error';

export interface UpdatePostRequest {
  id: string;
  title?: string;
  content?: string;
}

export class UpdatePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(request: UpdatePostRequest): Promise<Post> {
    const postId = PostId.create(request.id);
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw PostError.postNotFound(postId.toString());
    }

    if (request.title && request.content) {
      post.update(request.title, request.content);
    }

    const updatedPost = await this.postRepository.update(post);

    if (updatedPost === null) {
      throw PostError.postNotFound(postId.toString());
    }

    return updatedPost;
  }
}
