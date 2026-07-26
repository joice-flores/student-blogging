import { ILessonPlanRepository, LessonPlanId } from '@domain/lesson-plan';
import { ROLES } from '@domain/user';
import {
  GetLessonPlanByIdDto,
  LessonPlanDto
} from '@application/lesson-plan/dto/lesson-plan.dto';
import { toLessonPlanDto } from '@application/lesson-plan/mappers/lesson-plan.mapper';
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

    this.ensureCanAccess(lessonPlan.belongsToTeacher(input.teacherId), input);

    return toLessonPlanDto(lessonPlan);
  }

  private ensureCanAccess(isOwner: boolean, input: GetLessonPlanByIdDto): void {
    const isAdmin = input.requesterRole === ROLES.ADMIN;

    if (!isAdmin && !isOwner) {
      throw LessonPlanError.forbidden();
    }
  }
}
