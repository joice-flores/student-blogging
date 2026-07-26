import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { LESSON_PLANS } from '@shared/constants/i18n.keys';
import { UserError } from '@shared/errors/user/user-error';
import { validateOrThrow } from '@shared/utils/validation';
import { makeSaveLessonPlan } from '@infrastructure/http/factories/lesson-plan';
import { saveLessonPlanSchema } from '@infrastructure/http/controllers/lesson-plan/lesson-plan.validation';
import { LessonPlanPresenter } from '@infrastructure/http/presenters';

export async function save(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    throw UserError.unauthorized();
  }

  const data = validateOrThrow(saveLessonPlanSchema, request.body);
  const lessonPlan = await makeSaveLessonPlan().execute({
    ...data,
    teacherId: request.user.id,
    requesterRole: request.user.role
  });

  return reply.status(201).send({
    success: true,
    message: translate(LESSON_PLANS.SUCCESS.SAVED),
    data: LessonPlanPresenter.toHTTP(lessonPlan)
  });
}
