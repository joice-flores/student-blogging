import { FastifyInstance } from 'fastify';
import {
  authRegister,
  login,
  logout
} from '@infrastructure/http/controllers/auth';
import { makeAuthMiddleware } from '@infrastructure/http/middlewares/auth.middleware';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const authMiddleware = makeAuthMiddleware();
  const middleware = { preHandler: [authMiddleware] };

  fastify.post('/register', async (req, reply) => authRegister(req, reply));
  fastify.post('/login', async (req, reply) => login(req, reply));
  fastify.post('/logout', middleware, async (req, reply) => logout(req, reply));
}
