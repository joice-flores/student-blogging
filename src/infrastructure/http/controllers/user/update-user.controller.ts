import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { USERS } from '@shared/constants/i18n.keys';
import { makeUpdateUser } from '@infrastructure/http/factories/user';
import { updateUserSchema } from '@infrastructure/http/controllers/user/user.validation';
import { validateOrThrow } from '@shared/utils/validation';

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const data = validateOrThrow(updateUserSchema, request.body);
  const user = await makeUpdateUser().execute({
    id,
    requesterId: request.user!.id,
    requesterRole: request.user!.role,
    ...data
  });

  return reply.send({
    success: true,
    message: translate(USERS.SUCCESS.UPDATED),
    data: user
  });
}
