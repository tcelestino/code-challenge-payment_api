import { PaymentServiceImpl } from '@application/services/payment.service.impl';
import { PaymentRepositoryImpl } from '@infrastructure/repositories/payment.repository.impl';
import { PaymentProviderServiceImpl } from '@infrastructure/services/payment-provider.service.impl';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PaymentController } from '../controllers/payment.controller';
import { createSchemaValidation, getSchemaValidation } from '../schemas/payment.schema';

// TODO: create validations using zod

export async function paymentRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
): Promise<void> {
  const paymentRepository = new PaymentRepositoryImpl();
  const paymentProviderService = new PaymentProviderServiceImpl();
  const paymentService = new PaymentServiceImpl(paymentRepository, paymentProviderService);
  const paymentController = new PaymentController(paymentService);

  fastify.post(
    '/payments',
    {
      schema: {
        body: createSchemaValidation,
        response: {
          201: {
            type: 'object',
            properties: {
              paymentId: { type: 'string' },
              status: { type: 'string' },
            },
          },
        },
        tags: ['payments'],
        summary: 'Create a new payment',
        description: 'Creates a new payment and returns the payment ID and status',
      },
    },
    paymentController.createPayment.bind(paymentController),
  );

  fastify.get(
    '/payments/:paymentId',
    {
      schema: {
        params: getSchemaValidation,
        response: {
          200: {
            type: 'object',
            properties: {
              paymentId: { type: 'string' },
              status: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
        tags: ['payments'],
        summary: 'Get payment by ID',
        description: 'Returns payment details for the specified payment ID',
      },
    },
    paymentController.getPaymentById.bind(paymentController),
  );
}
