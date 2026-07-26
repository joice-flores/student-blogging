import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { LESSON_PLANS } from '@shared/constants/i18n.keys';
import { UserError } from '@shared/errors/user/user-error';
import { validateOrThrow } from '@shared/utils/validation';
import { makeGenerateLessonPlan } from '@infrastructure/http/factories/lesson-plan';
import { generateLessonPlanSchema } from '@infrastructure/http/controllers/lesson-plan/lesson-plan.validation';
import { LessonPlanPresenter } from '@infrastructure/http/presenters';

export async function generate(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    throw UserError.unauthorized();
  }

  const data = validateOrThrow(generateLessonPlanSchema, request.body);
  const lessonPlan = await makeGenerateLessonPlan().execute({
    ...data,
    teacherId: request.user.id
  });

  return reply.status(200).send({
    success: true,
    message: translate(LESSON_PLANS.SUCCESS.GENERATED),
    data: LessonPlanPresenter.toHTTP(lessonPlan)
  });
}
