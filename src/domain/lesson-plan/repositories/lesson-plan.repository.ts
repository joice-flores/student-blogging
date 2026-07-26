import { LessonPlan } from '@domain/lesson-plan/entities/lesson-plan';
import { LessonPlanId } from '@domain/lesson-plan/value-objects/lesson-plan-id';

export type ListLessonPlansQuery = {
  readonly teacherId?: string;
  readonly limit: number;
  readonly skip: number;
};

export interface ILessonPlanRepository {
  create(lessonPlan: LessonPlan): Promise<void>;
  findById(id: LessonPlanId): Promise<LessonPlan | null>;
  findByTeacherId(
    teacherId: string,
    query: ListLessonPlansQuery
  ): Promise<{ lessonPlans: LessonPlan[]; total: number }>;
  findAll(
    query: ListLessonPlansQuery
  ): Promise<{ lessonPlans: LessonPlan[]; total: number }>;
  delete(id: LessonPlanId): Promise<boolean>;
}
