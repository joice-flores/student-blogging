import {
  LessonPlan,
  Grade,
  ScheduleStep,
  Subject,
  Theme
} from '@domain/lesson-plan';
import {
  CreateLessonPlanDto,
  LessonPlanDto
} from '@application/lesson-plan/dto/lesson-plan.dto';
import { AiLessonPlanProvider } from '@application/providers/ai-lesson-plan-provider';

export class GenerateLessonPlan {
  constructor(private readonly aiLessonPlanProvider: AiLessonPlanProvider) {}

  async execute(input: CreateLessonPlanDto): Promise<LessonPlanDto> {
    const subject = Subject.create(input.subject);
    const grade = Grade.create(input.grade);
    const theme = Theme.create(input.theme);

    const sections = await this.aiLessonPlanProvider.generate({
      subject: subject.getValue(),
      grade: grade.getValue(),
      theme: theme.getValue()
    });

    const lessonPlan = LessonPlan.create({
      subject,
      grade,
      theme,
      objectives: [...sections.objectives],
      content: sections.content,
      methodology: sections.methodology,
      schedule: sections.schedule.map(step => ScheduleStep.create(step)),
      assessment: sections.assessment,
      resources: [...sections.resources],
      teacherId: input.teacherId
    });

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
}
