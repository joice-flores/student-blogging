import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetUserById } from '@infrastructure/http/factories/user';

export async function getUserById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const user = await makeGetUserById().execute({ id });

  return reply.send({
    success: true,
    data: user
  });
}
