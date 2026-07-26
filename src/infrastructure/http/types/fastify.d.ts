import { RoleValue } from '@domain/user';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: RoleValue;
    };
    telemetryStartTime?: bigint;
  }
}
