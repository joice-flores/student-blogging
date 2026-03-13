import fastify from 'fastify';
import cors from '@fastify/cors';
import { postRoutes } from '@infrastructure/http/routes/post';
import { authRoutes } from '@infrastructure/http/routes/auth';
import { errorHandler } from '@infrastructure/http/middlewares/error-handler.middleware';

function createServer() {
  const app = fastify({ logger: true });

  app.register(cors);
  app.register(authRoutes, { prefix: '/auth' });
  app.register(postRoutes, { prefix: '/posts' });

  app.get('/health', async () => ({ status: 'ok' }));

  app.setErrorHandler(errorHandler);

  return app;
}

export { createServer };
