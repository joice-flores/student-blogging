import { LessonPlanSectionsDto } from '@application/lesson-plan/dto/lesson-plan.dto';

export type GenerateLessonPlanInput = {
  readonly subject: string;
  readonly grade: string;
  readonly theme: string;
};

export interface AiLessonPlanProvider {
  generate(input: GenerateLessonPlanInput): Promise<LessonPlanSectionsDto>;
}
