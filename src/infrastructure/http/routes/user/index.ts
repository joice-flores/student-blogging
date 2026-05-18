import { FastifyInstance } from 'fastify';
import { createUser } from '@infrastructure/http/controllers/user';
import { makeAuthMiddleware } from '@infrastructure/http/middlewares/auth.middleware';
import { requireRoles } from '@infrastructure/http/middlewares/role.middleware';
import { USER_MANAGEMENT_POLICY } from '@shared/policies/constants/roles.policy';

export async function userRoutes(fastify: FastifyInstance): Promise<void> {
  const authMiddleware = makeAuthMiddleware();
  const requireAdmin = requireRoles(USER_MANAGEMENT_POLICY);

  fastify.post(
    '/',
    { preHandler: [authMiddleware, requireAdmin] },
    async (request, reply) => createUser(request, reply)
  );
}
