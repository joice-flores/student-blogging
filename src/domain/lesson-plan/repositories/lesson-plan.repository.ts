import { LessonPlan } from '@domain/lesson-plan/entities/lesson-plan';
import { LessonPlanId } from '@domain/lesson-plan/value-objects/lesson-plan-id';

export type LessonPlanSortBy = 'createdAt' | 'updatedAt' | 'subject' | 'grade';
export type LessonPlanSortOrder = 'asc' | 'desc';

export type ListLessonPlansQuery = {
  readonly limit: number;
  readonly skip: number;
  readonly sortBy?: LessonPlanSortBy;
  readonly sortOrder?: LessonPlanSortOrder;
  readonly subject?: string;
  readonly grade?: string;
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
