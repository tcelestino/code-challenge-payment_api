import { PaymentMethod } from '../../../../domain/models/payment.model';

export interface CreatePaymentBody {
  amount: number;
  currency: string;
  method: PaymentMethod;
  product_id: string;
}

export interface GetPaymentParams {
  paymentId: string;
}
