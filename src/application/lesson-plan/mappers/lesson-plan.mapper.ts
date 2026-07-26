import { LessonPlan } from '@domain/lesson-plan';
import { LessonPlanDto } from '@application/lesson-plan/dto/lesson-plan.dto';

export function toLessonPlanDto(lessonPlan: LessonPlan): LessonPlanDto {
  return {
    id: lessonPlan.id.toString(),
    subject: lessonPlan.subject.getValue(),
    grade: lessonPlan.grade.getValue(),
    theme: lessonPlan.theme.getValue(),
    objectives: [...lessonPlan.objectives],
    content: lessonPlan.content,
    methodology: lessonPlan.methodology,
    schedule: lessonPlan.schedule.map(step => step.toObject()),
    assessment: lessonPlan.assessment,
    resources: [...lessonPlan.resources],
    teacherId: lessonPlan.teacherId,
    createdAt: lessonPlan.createdAt,
    updatedAt: lessonPlan.updatedAt
  };
}
