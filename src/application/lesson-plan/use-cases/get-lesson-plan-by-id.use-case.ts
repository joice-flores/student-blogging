import { ILessonPlanRepository, LessonPlanId } from '@domain/lesson-plan';
import {
  GetLessonPlanByIdDto,
  LessonPlanDto
} from '@application/lesson-plan/dto/lesson-plan.dto';
import { toLessonPlanDto } from '@application/lesson-plan/mappers/lesson-plan.mapper';
import { ensureLessonPlanAccess } from '@application/lesson-plan/policies/lesson-plan-access.policy';
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

    ensureLessonPlanAccess({
      requesterRole: input.requesterRole,
      isOwner: lessonPlan.belongsToTeacher(input.teacherId)
    });

    return toLessonPlanDto(lessonPlan);
  }
}
