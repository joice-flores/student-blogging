export type CreatePostDto = {
  title: string;
  content: string;
  author: string;
};

export type UpdatePostDto = Partial<CreatePostDto> & { id: string };

export type DeletePostDto = { id: string };

export type GetPostByIdDto = { id: string };

export type SearchPostsDto = { query: string };

export type ListPostsDto = { limit: number; skip: number };
