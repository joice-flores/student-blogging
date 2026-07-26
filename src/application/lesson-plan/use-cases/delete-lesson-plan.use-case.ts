import { ILessonPlanRepository, LessonPlanId } from '@domain/lesson-plan';
import { ROLES } from '@domain/user';
import { DeleteLessonPlanDto } from '@application/lesson-plan/dto/lesson-plan.dto';
import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

export class DeleteLessonPlan {
  constructor(private readonly lessonPlanRepository: ILessonPlanRepository) {}

  async execute(input: DeleteLessonPlanDto): Promise<void> {
    const lessonPlanId = LessonPlanId.create(input.id);
    const lessonPlan = await this.lessonPlanRepository.findById(lessonPlanId);

    if (!lessonPlan) {
      throw LessonPlanError.notFound(input.id);
    }

    const isAdmin = input.requesterRole === ROLES.ADMIN;
    const isOwner = lessonPlan.belongsToTeacher(input.teacherId);

    if (!isAdmin && !isOwner) {
      throw LessonPlanError.forbidden();
    }

    await this.lessonPlanRepository.delete(lessonPlanId);
  }
}
