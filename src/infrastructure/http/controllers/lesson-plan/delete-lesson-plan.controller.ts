import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { LESSON_PLANS } from '@shared/constants/i18n.keys';
import { UserError } from '@shared/errors/user/user-error';
import { validateOrThrow } from '@shared/utils/validation';
import { makeDeleteLessonPlan } from '@infrastructure/http/factories/lesson-plan';
import { lessonPlanIdParamsSchema } from '@infrastructure/http/controllers/lesson-plan/lesson-plan.validation';

export async function deleteLessonPlan(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.user) {
    throw UserError.unauthorized();
  }

  const { id } = validateOrThrow(lessonPlanIdParamsSchema, request.params);
  await makeDeleteLessonPlan().execute({
    id,
    teacherId: request.user.id,
    requesterRole: request.user.role
  });

  return reply.status(200).send({
    success: true,
    message: translate(LESSON_PLANS.SUCCESS.DELETED)
  });
}
