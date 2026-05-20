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

export function requireSelfOrRoles(allowedRoles: RoleValue[]) {
  return async function selfOrRoleMiddleware(
    request: FastifyRequest,
    _reply: FastifyReply
  ): Promise<void> {
    const role = request.user?.role;

    if (role && allowedRoles.includes(role)) {
      return;
    }

    const params = request.params as { id?: string };
    const requesterId = request.user?.id;

    if (params.id && requesterId === params.id) {
      return;
    }

    throw UserError.forbidden();
  };
}
