export type ScheduleStepDocument = {
  duration: string;
  description: string;
};

export type LessonPlanDocument = {
  _id: string;
  subject: string;
  grade: string;
  theme: string;
  objectives: string[];
  content: string;
  methodology: string;
  schedule: ScheduleStepDocument[];
  assessment: string;
  resources: string[];
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
};
