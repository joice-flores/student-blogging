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
