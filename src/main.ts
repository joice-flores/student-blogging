import 'dotenv/config';
import { createServer } from '@infrastructure/http/server';
import { connectDatabase } from '@infrastructure/database/mongodb/connection';
import { makePrometheusTelemetry } from '@infrastructure/http/factories/telemetry';
import { env } from '@shared/env';

async function bootstrap() {
  await connectDatabase(env.MONGODB_URI);
  const prometheusTelemetry = makePrometheusTelemetry();

  const server = createServer(prometheusTelemetry);
  const port = env.PORT || 3000;
  const host = env.HOST || '0.0.0.0';

  server
    .listen({ port, host })
    .then(() => {
      console.log(`Server running on http://localhost:${port}`);
    })
    .catch(error => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}

bootstrap();
