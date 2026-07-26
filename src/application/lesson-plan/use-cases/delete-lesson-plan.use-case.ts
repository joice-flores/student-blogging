import { ILessonPlanRepository, LessonPlanId } from '@domain/lesson-plan';
import { DeleteLessonPlanDto } from '@application/lesson-plan/dto/lesson-plan.dto';
import { ensureLessonPlanAccess } from '@application/lesson-plan/policies/lesson-plan-access.policy';
import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

export class DeleteLessonPlan {
  constructor(private readonly lessonPlanRepository: ILessonPlanRepository) {}

  async execute(input: DeleteLessonPlanDto): Promise<void> {
    const lessonPlanId = LessonPlanId.create(input.id);
    const lessonPlan = await this.lessonPlanRepository.findById(lessonPlanId);

    if (!lessonPlan) {
      throw LessonPlanError.notFound(input.id);
    }

    ensureLessonPlanAccess({
      requesterRole: input.requesterRole,
      isOwner: lessonPlan.belongsToTeacher(input.teacherId)
    });

    await this.lessonPlanRepository.delete(lessonPlanId);
  }
}
