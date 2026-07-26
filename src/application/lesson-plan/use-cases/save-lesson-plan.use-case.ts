import {
  Grade,
  ILessonPlanRepository,
  LessonPlan,
  ScheduleStep,
  Subject,
  Theme
} from '@domain/lesson-plan';
import {
  LessonPlanDto,
  SaveLessonPlanDto
} from '@application/lesson-plan/dto/lesson-plan.dto';
import { toLessonPlanDto } from '@application/lesson-plan/mappers/lesson-plan.mapper';

export class SaveLessonPlan {
  constructor(private readonly lessonPlanRepository: ILessonPlanRepository) {}

  async execute(input: SaveLessonPlanDto): Promise<LessonPlanDto> {
    const lessonPlan = LessonPlan.create({
      subject: Subject.create(input.subject),
      grade: Grade.create(input.grade),
      theme: Theme.create(input.theme),
      objectives: [...input.objectives],
      content: input.content,
      methodology: input.methodology,
      schedule: input.schedule.map(step => ScheduleStep.create(step)),
      assessment: input.assessment,
      resources: [...input.resources],
      teacherId: input.teacherId
    });

    await this.lessonPlanRepository.create(lessonPlan);

    return toLessonPlanDto(lessonPlan);
  }
}
