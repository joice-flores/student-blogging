import { z } from 'zod';
import { ROLES } from '@domain/user';

export const authRegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum([ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]).optional()
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type AuthRegister = z.infer<typeof authRegisterSchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
