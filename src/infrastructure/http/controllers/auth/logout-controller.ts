import { FastifyReply, FastifyRequest } from 'fastify';
import { makeLogout } from '@infrastructure/http/factories/auth';

export function logout(_request: FastifyRequest, reply: FastifyReply) {
  makeLogout().execute();

  return reply.status(204).send();
}
