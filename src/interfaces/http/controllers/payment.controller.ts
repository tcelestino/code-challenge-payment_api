import { PaymentService } from '@domain/services/payment.service';
import { FastifyReply, FastifyRequest } from 'fastify';

//TODO: create interfaces to body and params

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  async createPayment(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { amount, currency, method, product_id } = request.body as any;

    const payment = await this.paymentService.createPayment({
      amount,
      currency,
      method,
      productId: product_id,
    });

    reply.status(201).send(payment);
  }

  async getPaymentById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { paymentId } = request.params as any;

    const payment = await this.paymentService.getPaymentById(paymentId);

    reply.status(200).send(payment);
  }
}
