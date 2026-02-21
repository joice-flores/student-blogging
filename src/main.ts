import 'dotenv/config';
import { createServer } from '@infrastructure/http/server';
import { connectDatabase } from '@infrastructure/database/mongodb/connection';
import { env } from '@shared/env';

async function bootstrap() {
  await connectDatabase(env.MONGODB_URI);

  const server = createServer();
  const port = env.PORT || 3000;

  server
    .listen({ port, host: '0.0.0.0' })
    .then(() => {
      console.log(`Server running on http://localhost:${port}`);
    })
    .catch(error => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}

bootstrap();
