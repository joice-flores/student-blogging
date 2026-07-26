import {
  Grade,
  LessonPlan,
  ScheduleStep,
  Subject,
  Theme
} from '@domain/lesson-plan';
import {
  CreateLessonPlanDto,
  LessonPlanDto
} from '@application/lesson-plan/dto/lesson-plan.dto';
import { toLessonPlanDto } from '@application/lesson-plan/mappers/lesson-plan.mapper';
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

    return toLessonPlanDto(lessonPlan);
  }
}
