import { SaveLessonPlan } from '@application/lesson-plan';
import { MongoLessonPlanRepository } from '@infrastructure/database/mongodb/repositories/mongo-lesson-plan.repository';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

export function makeSaveLessonPlan(): SaveLessonPlan {
  const lessonPlanRepository = new MongoLessonPlanRepository(getDatabase());
  return new SaveLessonPlan(lessonPlanRepository);
}
