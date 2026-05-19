import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { USERS } from '@shared/constants/i18n.keys';
import { makeDeleteUser } from '@infrastructure/http/factories/user';

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await makeDeleteUser().execute({
    id,
    requesterId: request.user!.id,
    requesterRole: request.user!.role
  });

  return reply.send({
    success: true,
    message: translate(USERS.SUCCESS.DELETED)
  });
}
