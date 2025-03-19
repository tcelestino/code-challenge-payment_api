import { config } from '@config/environment';
import { PaymentProviderError } from '@domain/errors/payment-provider.error';
import {
  GetPaymentResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentProviderService,
} from '@domain/services/payment-provider.service';
import { cacheSet } from '../cache/redis';

export class PaymentProviderServiceImpl implements PaymentProviderService {
  private readonly baseUrl: string;
  private readonly cacheKey: string;

  constructor() {
    this.baseUrl = config.externalService.url;
    this.cacheKey = config.cache.key;
  }

  async initiatePayment(request: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new PaymentProviderError(
          `Payment provider returned error: ${response.status} ${errorData.error || 'Unknown error'}`,
        );
      }

      const data = await response.json();
      return data as InitiatePaymentResponse;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw new PaymentProviderError(
        error instanceof Error ? error.message : 'Failed to process payment request',
      );
    }
  }

  async getPayment(paymentId: string): Promise<GetPaymentResponse> {
    try {
      const cacheKey = `${this.cacheKey}:${paymentId}`;
      console.log(`Sending request to ${this.baseUrl}/list-payment/${paymentId}`);

      const response = await fetch(`${this.baseUrl}/list-payment/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new PaymentProviderError(
          `Payment provider returned error: ${response.status} ${errorData.error || 'Unknown error'}`,
        );
      }

      const data = await response.json();
      await cacheSet(cacheKey, data);

      return data as GetPaymentResponse;
    } catch (error) {
      console.error('Error getting payment:', error);
      throw new PaymentProviderError(
        error instanceof Error ? error.message : 'Failed to retrieve payment information',
      );
    }
  }
}
