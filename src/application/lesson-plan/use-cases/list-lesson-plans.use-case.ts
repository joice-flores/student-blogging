import { ILessonPlanRepository } from '@domain/lesson-plan';
import { ROLES } from '@domain/user';
import {
  LessonPlanDto,
  ListLessonPlansDto
} from '@application/lesson-plan/dto/lesson-plan.dto';

export class ListLessonPlans {
  constructor(private readonly lessonPlanRepository: ILessonPlanRepository) {}

  async execute(
    input: ListLessonPlansDto
  ): Promise<{ lessonPlans: LessonPlanDto[]; total: number }> {
    const query = {
      limit: input.limit,
      skip: input.skip
    };

    const result =
      input.requesterRole === ROLES.ADMIN
        ? await this.lessonPlanRepository.findAll(query)
        : await this.lessonPlanRepository.findByTeacherId(
            input.teacherId,
            query
          );

    return {
      total: result.total,
      lessonPlans: result.lessonPlans.map(lessonPlan => ({
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
      }))
    };
  }
}
