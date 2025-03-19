import { PaymentNotFoundError } from '@domain/errors/payment-not-found.error';
import { PaymentProviderError } from '@domain/errors/payment-provider.error';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  request.log.error(error);

  if (error instanceof PaymentNotFoundError) {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: error.message,
    });
    return;
  }

  if (error instanceof PaymentProviderError) {
    reply.status(500).send({
      statusCode: 500,
      error: 'Payment Provider Error',
      message: error.message,
    });
    return;
  }

  if (error instanceof ZodError) {
    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation error',
      details: error.format(),
    });
    return;
  }

  // Default error handler
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    statusCode,
    error: error.name || 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
  });
}
