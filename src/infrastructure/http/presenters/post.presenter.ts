import { Post } from '@domain/post/entities/post';

export type PostHttp = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
};

export class PostPresenter {
  static toHTTP(post: Post): PostHttp {
    return {
      id: post.id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
  }

  static toHTTPList(posts: Post[]): PostHttp[] {
    return posts.map(post => PostPresenter.toHTTP(post));
  }
}
