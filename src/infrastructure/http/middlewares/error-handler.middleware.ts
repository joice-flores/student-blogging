import { AppError, Codes } from '@shared/errors/builder';
import { FastifyReply, FastifyRequest } from 'fastify';
import { translate } from '@shared/i18n';
import { ERRORS } from '@shared/constants/i18n.keys';

interface ErrorHandlerMap {
  [key: string]: (
    error: AppError,
    request: FastifyRequest,
    reply: FastifyReply
  ) => FastifyReply;
}

const errorHandlerMap: ErrorHandlerMap = {
  AppError: (error, request, reply) => {
    return reply.status(error.statusCode).send(error.toJSON());
  }
};

export async function errorHandler(
  error: AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const handler = errorHandlerMap[error.constructor.name];

  if (handler) return handler(error, request, reply);

  return reply.status(500).send({
    error: {
      message: translate(ERRORS.INTERNAL),
      statusCode: 500,
      code: Codes.INTERNAL_ERROR
    }
  });
}
