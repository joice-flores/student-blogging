import fastify from 'fastify';
import cors from '@fastify/cors';
import { postRoutes } from '@infrastructure/http/routes/post';
import { authRoutes } from '@infrastructure/http/routes/auth';
import { userRoutes } from '@infrastructure/http/routes/user';
import { lessonPlanRoutes } from '@infrastructure/http/routes/lesson-plan';
import { errorHandler } from '@infrastructure/http/middlewares/error-handler.middleware';
import { TechnicalTelemetryPort } from '@infrastructure/providers/telemetry';

function createServer(prometheusTelemetry: TechnicalTelemetryPort) {
  const app = fastify({ logger: true });

  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type']
  });

  app.register(authRoutes, { prefix: '/auth' });
  app.register(postRoutes, { prefix: '/posts' });
  app.register(userRoutes, { prefix: '/users' });
  app.register(lessonPlanRoutes, { prefix: '/lesson-plans' });
  app.get('/health', async () => ({ status: 'ok' }));

  app.get('/metrics', async (_, reply) => {
    reply.type(prometheusTelemetry.getMetricsRegistryContentType());
    return await prometheusTelemetry.getMetricsRegistryString();
  });

  app.setErrorHandler(errorHandler);

  app.addHook('onRequest', async request => {
    request.telemetryStartTime = process.hrtime.bigint();
  });

  app.addHook('onResponse', async (request, reply) => {
    const startedAt = request.telemetryStartTime;

    if (!startedAt) {
      return;
    }

    const finishedAt = process.hrtime.bigint();
    const method = request.method;
    const route = request.routeOptions?.url ?? 'unknown';
    const statusCode = String(reply.statusCode);
    const durationSeconds = Number(finishedAt - startedAt) / 1_000_000_000;

    prometheusTelemetry.recordHttpRequest({
      method,
      route,
      statusCode,
      durationSeconds
    });
  });

  return app;
}

export { createServer };
