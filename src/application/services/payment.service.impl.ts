import { config } from '../../config/environment';
import { PaymentNotFoundError } from '../../domain/errors/payment-not-found.error';
import { Payment, PaymentMethod, PaymentStatus } from '../../domain/models/payment.model';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import {
  GetPaymentResponse,
  InitiatePaymentRequest,
  PaymentProviderService,
} from '../../domain/services/payment-provider.service';
import {
  CreatePaymentDTO,
  PaymentResponseDTO,
  PaymentService,
} from '../../domain/services/payment.service';
import { cacheGet } from '../../infrastructure/cache/redis';

export class PaymentServiceImpl implements PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentProviderService: PaymentProviderService,
  ) {}

  async createPayment(data: CreatePaymentDTO): Promise<PaymentResponseDTO> {
    const paymentRequest: InitiatePaymentRequest = {
      money: {
        amount: data.amount,
        currency: data.currency,
      },
      payment_method: this.mapToPaymentMethod(data.method),
      product_id: data.productId,
    };

    const providerResponse = await this.paymentProviderService.initiatePayment(paymentRequest);
    const { amount, currency, method, productId } = data;
    const { tx_id, status } = providerResponse;

    const payment: Payment = {
      amount,
      currency,
      method,
      productId,
      paymentId: tx_id,
      status: this.mapToPaymentStatus(status),
    };

    await this.paymentRepository.create(payment);

    return {
      paymentId: tx_id,
      status: payment.status,
    };
  }

  async getPaymentById(paymentId: string): Promise<PaymentResponseDTO> {
    const cacheKey = `${config.cache.key}:${paymentId}`;
    const payment = await this.paymentRepository.findByPaymentId(paymentId);

    if (!payment) {
      throw new PaymentNotFoundError(`Payment with ID ${paymentId} not found`);
    }

    if (payment.status === PaymentStatus.PENDING) {
      const cachedPayment = await cacheGet<GetPaymentResponse>(cacheKey);

      if (cachedPayment) {
        console.log(`Retrieved payment ${paymentId} from cache`);
        return {
          paymentId: cachedPayment.tx_id,
          status: this.mapToPaymentStatus(cachedPayment.status),
        };
      }
    }

    const providerResponse = await this.paymentProviderService.getPayment(payment.paymentId);

    const { tx_id, status } = providerResponse;
    const mappedStatus = this.mapToPaymentStatus(status);

    if (status === 'processed') {
      await this.updatePaymentStatus(tx_id, mappedStatus);
    }

    return {
      paymentId: tx_id,
      status: mappedStatus,
    };
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<void> {
    await this.paymentRepository.update(paymentId, status);
  }

  private mapToPaymentStatus(status: string): PaymentStatus {
    switch (status) {
      case 'processed':
        return PaymentStatus.PROCESSED;
      case 'canceled':
        return PaymentStatus.CANCELED;
      default:
        return PaymentStatus.PENDING;
    }
  }

  private mapToPaymentMethod(method: string): string {
    switch (method) {
      case PaymentMethod.PAYPAL:
        return 'pay-pal';
      case PaymentMethod.CREDIT_CARD:
        return 'credit-card';
      default:
        return 'pix';
    }
  }
}
