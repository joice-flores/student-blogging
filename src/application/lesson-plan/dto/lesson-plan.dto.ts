import { RoleValue } from '@domain/user';

export type CreateLessonPlanDto = {
  readonly subject: string;
  readonly grade: string;
  readonly theme: string;
  readonly teacherId: string;
};

export type ScheduleStepDto = {
  readonly duration: string;
  readonly description: string;
};

export type LessonPlanSectionsDto = {
  readonly objectives: readonly string[];
  readonly content: string;
  readonly methodology: string;
  readonly schedule: readonly ScheduleStepDto[];
  readonly assessment: string;
  readonly resources: readonly string[];
};

export type LessonPlanDto = {
  readonly id: string;
  readonly subject: string;
  readonly grade: string;
  readonly theme: string;
  readonly objectives: readonly string[];
  readonly content: string;
  readonly methodology: string;
  readonly schedule: readonly ScheduleStepDto[];
  readonly assessment: string;
  readonly resources: readonly string[];
  readonly teacherId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type SaveLessonPlanDto = {
  readonly subject: string;
  readonly grade: string;
  readonly theme: string;
  readonly objectives: readonly string[];
  readonly content: string;
  readonly methodology: string;
  readonly schedule: readonly ScheduleStepDto[];
  readonly assessment: string;
  readonly resources: readonly string[];
  readonly teacherId: string;
};

export type ListLessonPlansDto = {
  readonly teacherId: string;
  readonly requesterRole: RoleValue;
  readonly limit: number;
  readonly skip: number;
  readonly sortBy?: 'createdAt' | 'updatedAt' | 'subject' | 'grade';
  readonly sortOrder?: 'asc' | 'desc';
  readonly subject?: string;
  readonly grade?: string;
};

export type ListLessonPlansResultDto = {
  readonly lessonPlans: readonly LessonPlanDto[];
  readonly total: number;
};

export type GetLessonPlanByIdDto = {
  readonly id: string;
  readonly teacherId: string;
  readonly requesterRole: RoleValue;
};

export type DeleteLessonPlanDto = {
  readonly id: string;
  readonly teacherId: string;
  readonly requesterRole: RoleValue;
};
