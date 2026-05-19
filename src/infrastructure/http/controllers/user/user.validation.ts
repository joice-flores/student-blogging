import { z } from 'zod';
import { ROLES } from '@domain/user';

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum([ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT])
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200).optional(),
  role: z.enum([ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]).optional()
});

export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
