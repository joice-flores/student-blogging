import { GenerateLessonPlan } from '@application/lesson-plan';
import { StubLessonPlanProvider } from '@infrastructure/providers/ai';

export function makeGenerateLessonPlan(): GenerateLessonPlan {
  const aiLessonPlanProvider = new StubLessonPlanProvider();
  return new GenerateLessonPlan(aiLessonPlanProvider);
}
