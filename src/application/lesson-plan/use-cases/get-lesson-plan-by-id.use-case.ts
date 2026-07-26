import { ILessonPlanRepository, LessonPlanId } from '@domain/lesson-plan';
import { ROLES } from '@domain/user';
import {
  GetLessonPlanByIdDto,
  LessonPlanDto
} from '@application/lesson-plan/dto/lesson-plan.dto';
import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

export class GetLessonPlanById {
  constructor(private readonly lessonPlanRepository: ILessonPlanRepository) {}

  async execute(input: GetLessonPlanByIdDto): Promise<LessonPlanDto> {
    const lessonPlan = await this.lessonPlanRepository.findById(
      LessonPlanId.create(input.id)
    );

    if (!lessonPlan) {
      throw LessonPlanError.notFound(input.id);
    }

    const isAdmin = input.requesterRole === ROLES.ADMIN;
    const isOwner = lessonPlan.belongsToTeacher(input.teacherId);

    if (!isAdmin && !isOwner) {
      throw LessonPlanError.forbidden();
    }

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
