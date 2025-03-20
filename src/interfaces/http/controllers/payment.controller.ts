import { FastifyReply, FastifyRequest } from 'fastify';
import { PaymentService } from '../../../domain/services/payment.service';
import { CreatePaymentBody, GetPaymentParams } from './interfaces/payment.interface';

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  async createPayment(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { amount, currency, method, product_id } = request.body as CreatePaymentBody;

    const payment = await this.paymentService.createPayment({
      amount,
      currency,
      method,
      productId: product_id,
    });

    reply.status(201).send(payment);
  }

  async getPaymentById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { paymentId } = request.params as GetPaymentParams;

    const payment = await this.paymentService.getPaymentById(paymentId);

    reply.status(200).send(payment);
  }
}
