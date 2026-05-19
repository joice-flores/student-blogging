import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListUsers } from '@infrastructure/http/factories/user';

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const users = await makeListUsers().execute();

  return reply.send({
    success: true,
    data: users
  });
}
