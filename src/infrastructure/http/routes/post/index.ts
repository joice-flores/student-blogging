import { FastifyInstance } from 'fastify';
import {
  create,
  deletePost,
  getById,
  list,
  search,
  update
} from '@infrastructure/http/controllers/post';
import { makeAuthMiddleware } from '@infrastructure/http/middlewares/auth.middleware';
import { requireRoles } from '@infrastructure/http/middlewares/role.middleware';
import { POST_MANAGEMENT_POLICY } from '@shared/policies/constants/roles.policy';

export async function postRoutes(fastify: FastifyInstance) {
  const authMiddleware = makeAuthMiddleware();
  const requireTeacherOrAdmin = requireRoles(POST_MANAGEMENT_POLICY);
  const authOnly = { preHandler: [authMiddleware] };
  const authAndManage = { preHandler: [authMiddleware, requireTeacherOrAdmin] };

  fastify.get('/:id', authOnly, async (request, reply) =>
    getById(request, reply)
  );

  fastify.get('/', authOnly, async (request, reply) => list(request, reply));

  fastify.get('/search', authOnly, async (request, reply) =>
    search(request, reply)
  );

  fastify.post('/', authAndManage, async (request, reply) =>
    create(request, reply)
  );

  fastify.delete('/:id', authAndManage, async (request, reply) =>
    deletePost(request, reply)
  );

  fastify.put('/:id', authAndManage, async (request, reply) =>
    update(request, reply)
  );
}
