import fastify from 'fastify';
import cors from '@fastify/cors';
import { postRoutes } from '@infrastructure/http/routes/post';
import { errorHandler } from './middlewares/error-handler';

function createServer() {
  const app = fastify({ logger: true });

  app.register(cors);
  app.register(postRoutes, { prefix: '/posts' });

  app.get('/health', async () => ({ status: 'ok' }));

  app.setErrorHandler(errorHandler);

  return app;
}

export { createServer };
