import { FastifyRequest, FastifyReply } from 'fastify';
import { UserError } from '@shared/errors/user/user-error';
import { validateOrThrow } from '@shared/utils/validation';
import { makeGetLessonPlanById } from '@infrastructure/http/factories/lesson-plan';
import { lessonPlanIdParamsSchema } from '@infrastructure/http/controllers/lesson-plan/lesson-plan.validation';
import { LessonPlanPresenter } from '@infrastructure/http/presenters';

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    throw UserError.unauthorized();
  }

  const { id } = validateOrThrow(lessonPlanIdParamsSchema, request.params);
  const lessonPlan = await makeGetLessonPlanById().execute({
    id,
    teacherId: request.user.id,
    requesterRole: request.user.role
  });

  return reply.status(200).send({
    success: true,
    data: LessonPlanPresenter.toHTTP(lessonPlan)
  });
}
