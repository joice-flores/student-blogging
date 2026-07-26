import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { LESSON_PLANS } from '@shared/constants/i18n.keys';
import { UserError } from '@shared/errors/user/user-error';
import { makeDeleteLessonPlan } from '@infrastructure/http/factories/lesson-plan';

export async function deleteLessonPlan(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.user) {
    throw UserError.unauthorized();
  }

  const { id } = request.params as { id: string };
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
