import { FastifyReply, FastifyRequest } from 'fastify';
import { UserError } from '@shared/errors/user/user-error';
import { makeTokenProvider } from '@infrastructure/http/factories/auth';

export function makeAuthMiddleware() {
  return async function authMiddleware(
    request: FastifyRequest,
    _reply: FastifyReply
  ): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw UserError.unauthorized();
    }

    const token = authHeader.slice(7);

    try {
      const tokenProvider = makeTokenProvider();
      const payload = tokenProvider.verify(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };
    } catch {
      throw UserError.unauthorized();
    }
  };
}
