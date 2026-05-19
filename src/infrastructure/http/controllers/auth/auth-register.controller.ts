import { FastifyReply, FastifyRequest } from 'fastify';
import { authRegisterSchema } from '@infrastructure/http/controllers/auth/auth.validation';
import { makeAuthRegister } from '@infrastructure/http/factories/auth';

export async function authRegister(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = authRegisterSchema.parse(request.body);

  const result = await makeAuthRegister().execute({
    name: body.name,
    email: body.email,
    password: body.password,
    role: body.role
  });

  return reply.status(201).send(result);
}
