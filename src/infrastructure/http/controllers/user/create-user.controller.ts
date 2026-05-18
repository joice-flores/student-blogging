import { FastifyReply, FastifyRequest } from 'fastify';
import { validateOrThrow } from '@shared/utils/validation';
import { createUserSchema } from '@infrastructure/http/controllers/user/user.validation';
import { makeCreateUser } from '@infrastructure/http/factories/user';

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const data = validateOrThrow(createUserSchema, request.body);
  const result = await makeCreateUser().execute(data);

  return reply.status(201).send(result);
}
