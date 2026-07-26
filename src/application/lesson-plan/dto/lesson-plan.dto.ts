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

export type LessonPlanDto = Partial<CreateLessonPlanDto> & LessonPlanSectionsDto & {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type SaveLessonPlanDto = Partial<CreateLessonPlanDto> & LessonPlanSectionsDto & {
  readonly requesterRole: string;
};

export type ListLessonPlansDto = {
  readonly teacherId: string;
  readonly requesterRole: string;
  readonly limit: number;
  readonly skip: number;
};

export type GetLessonPlanByIdDto = {
  readonly id: string;
  readonly teacherId: string;
  readonly requesterRole: string;
};

export type DeleteLessonPlanDto = {
  readonly id: string;
  readonly teacherId: string;
  readonly requesterRole: string;
};
