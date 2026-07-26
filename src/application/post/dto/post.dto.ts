export type CreatePostDto = {
  readonly title: string;
  readonly content: string;
  readonly author: string;
};

export type UpdatePostDto = Partial<CreatePostDto> & { readonly id: string };

export type DeletePostDto = { readonly id: string };

export type GetPostByIdDto = { readonly id: string };

export type SearchPostsDto = { readonly query: string };

export type ListPostsDto = { readonly limit: number; readonly skip: number };
