import { FastifyReply, FastifyRequest } from 'fastify';
import { RoleValue } from '@domain/user';
import { UserError } from '@shared/errors/user/user-error';

export function requireRoles(allowedRoles: RoleValue[]) {
  return async function roleMiddleware(
    request: FastifyRequest,
    _reply: FastifyReply
  ): Promise<void> {
    const role = request.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      throw UserError.forbidden();
    }
  };
}
