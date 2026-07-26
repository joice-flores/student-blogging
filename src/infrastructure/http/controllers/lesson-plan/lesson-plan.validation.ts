import { z } from 'zod';
import { ALLOWED_GRADES, ALLOWED_SUBJECTS } from '@domain/lesson-plan';

export const generateLessonPlanSchema = z.object({
  subject: z.enum(ALLOWED_SUBJECTS),
  grade: z.enum(ALLOWED_GRADES),
  theme: z.string().trim().min(3)
});

export const scheduleStepSchema = z.object({
  duration: z.string().trim().min(1),
  description: z.string().trim().min(1)
});

export const saveLessonPlanSchema = z.object({
  subject: z.enum(ALLOWED_SUBJECTS),
  grade: z.enum(ALLOWED_GRADES),
  theme: z.string().trim().min(3),
  objectives: z.array(z.string().trim().min(1)).min(1),
  content: z.string().trim().min(1),
  methodology: z.string().trim().min(1),
  schedule: z.array(scheduleStepSchema).min(1),
  assessment: z.string().trim().min(1),
  resources: z.array(z.string().trim().min(1)).min(1)
});

export const lessonPlanIdParamsSchema = z.object({
  id: z.string().trim().min(1)
});

export const listLessonPlansQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  skip: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(['createdAt', 'updatedAt', 'subject', 'grade']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  subject: z.enum(ALLOWED_SUBJECTS).optional(),
  grade: z.enum(ALLOWED_GRADES).optional()
});
