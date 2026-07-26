import { ILessonPlanRepository } from '@domain/lesson-plan';
import { ROLES } from '@domain/user';
import {
  ListLessonPlansDto,
  ListLessonPlansResultDto
} from '@application/lesson-plan/dto/lesson-plan.dto';
import { toLessonPlanDto } from '@application/lesson-plan/mappers/lesson-plan.mapper';

export class ListLessonPlans {
  constructor(private readonly lessonPlanRepository: ILessonPlanRepository) {}

  async execute(input: ListLessonPlansDto): Promise<ListLessonPlansResultDto> {
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
      lessonPlans: result.lessonPlans.map(toLessonPlanDto)
    };
  }
}
