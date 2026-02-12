export type CreatePostDto = {
  title: string;
  content: string;
  author: string;
};

export type UpdatePostDto = Partial<CreatePostDto>;
