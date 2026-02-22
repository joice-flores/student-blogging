import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(500, 'Title must be less than 500 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(50000, 'Content must be less than 50000 characters'),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(200, 'Author must be less than 200 characters')
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  content: z.string().min(1).max(50000).optional(),
  author: z.string().min(1).max(200).optional()
});

export const searchPostSchema = z.object({
  q: z.string().min(1, 'Search query is required')
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
export type SearchPostSchema = z.infer<typeof searchPostSchema>;
