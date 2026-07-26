import { FastifyRequest, FastifyReply } from 'fastify';
import { UserError } from '@shared/errors/user/user-error';
import { validateOrThrow } from '@shared/utils/validation';
import { makeListLessonPlans } from '@infrastructure/http/factories/lesson-plan';
import { listLessonPlansQuerySchema } from '@infrastructure/http/controllers/lesson-plan/lesson-plan.validation';
import { LessonPlanPresenter } from '@infrastructure/http/presenters';

export async function list(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    throw UserError.unauthorized();
  }

  const query = validateOrThrow(listLessonPlansQuerySchema, request.query);
  const { lessonPlans, total } = await makeListLessonPlans().execute({
    teacherId: request.user.id,
    requesterRole: request.user.role,
    limit: query.limit,
    skip: query.skip,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    subject: query.subject,
    grade: query.grade
  });

  return reply.status(200).send({
    success: true,
    data: LessonPlanPresenter.toHTTPList(lessonPlans),
    pagination: {
      limit: query.limit,
      skip: query.skip,
      total,
      hasMore: query.skip + query.limit < total,
      sortBy: query.sortBy ?? 'createdAt',
      sortOrder: query.sortOrder ?? 'desc',
      filters: {
        subject: query.subject,
        grade: query.grade
      }
    }
  });
}
