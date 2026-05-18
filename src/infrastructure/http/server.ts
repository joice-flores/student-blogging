import fastify from 'fastify';
import cors from '@fastify/cors';
import { postRoutes } from '@infrastructure/http/routes/post';
import { authRoutes } from '@infrastructure/http/routes/auth';
import { userRoutes } from '@infrastructure/http/routes/user';
import { errorHandler } from '@infrastructure/http/middlewares/error-handler.middleware';

function createServer() {
  const app = fastify({ logger: true });

  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type']
  });

  app.register(authRoutes, { prefix: '/auth' });
  app.register(postRoutes, { prefix: '/posts' });
  app.register(userRoutes, { prefix: '/users' });
  app.get('/health', async () => ({ status: 'ok' }));
  app.setErrorHandler(errorHandler);

  return app;
}

export { createServer };
