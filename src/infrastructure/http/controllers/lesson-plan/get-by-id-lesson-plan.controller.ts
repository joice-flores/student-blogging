import { FastifyRequest, FastifyReply } from 'fastify';
import { UserError } from '@shared/errors/user/user-error';
import { makeGetLessonPlanById } from '@infrastructure/http/factories/lesson-plan';
import { LessonPlanPresenter } from '@infrastructure/http/presenters';

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    throw UserError.unauthorized();
  }

  const { id } = request.params as { id: string };
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
