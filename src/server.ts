import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastify, { FastifyInstance } from 'fastify';
import { config } from './config/environment';
import { errorHandler } from './interfaces/http/middlewares/error-handler';
import { paymentRoutes } from './interfaces/http/routes/payment.routes';

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

export async function createServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: envToLogger[config.server.nodeEnv],
  });

  await server.register(rateLimit, {
    max: 100,
    timeWindow: 1000,
  });

  // TODO: use zod validation implementation
  // server.setValidatorCompiler(validatorCompiler);
  // server.setSerializerCompiler(serializerCompiler);

  // Register Swagger
  await server.register(swagger, {
    swagger: {
      info: {
        title: 'Payment API',
        description: 'API for payment services',
        version: '1.0.0',
      },
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/documentation',
  });

  server.register(paymentRoutes, { prefix: '/api/v1' });

  server.setErrorHandler(errorHandler);

  return server;
}
