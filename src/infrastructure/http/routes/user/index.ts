import { FastifyInstance } from 'fastify';
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser
} from '@infrastructure/http/controllers/user';
import { makeAuthMiddleware } from '@infrastructure/http/middlewares/auth.middleware';
import {
  requireRoles,
  requireSelfOrRoles
} from '@infrastructure/http/middlewares/role.middleware';
import { USER_MANAGEMENT_POLICY } from '@shared/policies/constants/roles.policy';

export async function userRoutes(fastify: FastifyInstance): Promise<void> {
  const authMiddleware = makeAuthMiddleware();
  const requireAdmin = requireRoles(USER_MANAGEMENT_POLICY);
  const requireAdminOrSelf = requireSelfOrRoles(USER_MANAGEMENT_POLICY);

  fastify.post(
    '/',
    { preHandler: [authMiddleware, requireAdmin] },
    async (request, reply) => createUser(request, reply)
  );

  fastify.register(async protectedRoutes => {
    protectedRoutes.addHook('onRequest', authMiddleware);

    protectedRoutes.get(
      '/',
      { preHandler: [requireAdmin] },
      async (request, reply) => listUsers(request, reply)
    );
    protectedRoutes.get(
      '/:id',
      { preHandler: [requireAdminOrSelf] },
      async (request, reply) => getUserById(request, reply)
    );
    protectedRoutes.put(
      '/:id',
      { preHandler: [requireAdminOrSelf] },
      async (request, reply) => updateUser(request, reply)
    );
    protectedRoutes.delete(
      '/:id',
      { preHandler: [requireAdmin] },
      async (request, reply) => deleteUser(request, reply)
    );
  });
}
