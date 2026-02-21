// src/shared/utils/validation.ts
import { z } from 'zod';
import { ErrorBuilder } from '@shared/errors/builder';

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw ErrorBuilder.fromZodError(result.error);
  }

  return result.data;
}
