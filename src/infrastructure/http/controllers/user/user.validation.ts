import { z } from 'zod';
import { ROLES } from '@domain/user';

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum([ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT])
});

export type CreateUserBody = z.infer<typeof createUserSchema>;
