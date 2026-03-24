import fastify from 'fastify';
import cors from '@fastify/cors';
import { postRoutes } from '@infrastructure/http/routes/post';
import { authRoutes } from '@infrastructure/http/routes/auth';
import { errorHandler } from '@infrastructure/http/middlewares/error-handler.middleware';

function createServer() {
  const app = fastify({ logger: true });

  app.register(cors, {
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://172.18.0.2:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type']
  });

  app.register(authRoutes, { prefix: '/auth' });
  app.register(postRoutes, { prefix: '/posts' });
  app.get('/health', async () => ({ status: 'ok' }));
  app.setErrorHandler(errorHandler);

  return app;
}

export { createServer };
