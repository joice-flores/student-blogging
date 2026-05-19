import { FastifyReply, FastifyRequest } from 'fastify';
import { loginBodySchema } from './auth.validation';
import { makeLogin } from '@infrastructure/http/factories/auth';

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const body = loginBodySchema.parse(request.body);

  const result = await makeLogin().execute({
    email: body.email,
    password: body.password
  });

  console.log(
    'login >>>>>>>>',
    `[login] user=${result.user.email} role=${result.user.role}`
  );

  return reply.status(200).send(result);
}
