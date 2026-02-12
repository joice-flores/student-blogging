import fastify from 'fastify';
import cors from '@fastify/cors';
import { postRoutes } from '@infrastructure/http/routes/post.routes';

export function createServer() {
  const app = fastify({ logger: true });

  app.register(cors);
  app.register(postRoutes, { prefix: '/posts' });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
