export type ScheduleStepDocument = {
  readonly duration: string;
  readonly description: string;
};

export type LessonPlanDocument = {
  readonly _id: string;
  readonly subject: string;
  readonly grade: string;
  readonly theme: string;
  readonly objectives: string[];
  readonly content: string;
  readonly methodology: string;
  readonly schedule: ScheduleStepDocument[];
  readonly assessment: string;
  readonly resources: string[];
  readonly teacherId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
