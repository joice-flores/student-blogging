import { FastifyInstance } from 'fastify';
import {
  deleteLessonPlan,
  generate,
  getById,
  list,
  save
} from '@infrastructure/http/controllers/lesson-plan';
import { makeAuthMiddleware } from '@infrastructure/http/middlewares/auth.middleware';
import { requireRoles } from '@infrastructure/http/middlewares/role.middleware';
import { LESSON_PLAN_POLICY } from '@shared/policies/constants/roles.policy';

export async function lessonPlanRoutes(fastify: FastifyInstance) {
  const authMiddleware = makeAuthMiddleware();
  const requireTeacherOrAdmin = requireRoles(LESSON_PLAN_POLICY);
  const authAndManage = {
    preHandler: [authMiddleware, requireTeacherOrAdmin]
  };

  fastify.post('/generate', authAndManage, async (request, reply) =>
    generate(request, reply)
  );

  fastify.get('/', authAndManage, async (request, reply) =>
    list(request, reply)
  );

  fastify.get('/:id', authAndManage, async (request, reply) =>
    getById(request, reply)
  );

  fastify.post('/', authAndManage, async (request, reply) =>
    save(request, reply)
  );

  fastify.delete('/:id', authAndManage, async (request, reply) =>
    deleteLessonPlan(request, reply)
  );
}
