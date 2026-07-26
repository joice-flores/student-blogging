import { LessonPlanDto } from '@application/lesson-plan/dto/lesson-plan.dto';

export type LessonPlanHttp = {
  id: string;
  subject: string;
  grade: string;
  theme: string;
  objectives: string[];
  content: string;
  methodology: string;
  schedule: Array<{ duration: string; description: string }>;
  assessment: string;
  resources: string[];
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class LessonPlanPresenter {
  static toHTTP(lessonPlan: LessonPlanDto): LessonPlanHttp {
    return {
      id: lessonPlan.id,
      subject: lessonPlan.subject,
      grade: lessonPlan.grade,
      theme: lessonPlan.theme,
      objectives: [...lessonPlan.objectives],
      content: lessonPlan.content,
      methodology: lessonPlan.methodology,
      schedule: lessonPlan.schedule.map(step => ({
        duration: step.duration,
        description: step.description
      })),
      assessment: lessonPlan.assessment,
      resources: [...lessonPlan.resources],
      teacherId: lessonPlan.teacherId,
      createdAt: lessonPlan.createdAt,
      updatedAt: lessonPlan.updatedAt
    };
  }

  static toHTTPList(lessonPlans: LessonPlanDto[]): LessonPlanHttp[] {
    return lessonPlans.map(lessonPlan => LessonPlanPresenter.toHTTP(lessonPlan));
  }
}
