import { Payment, PaymentStatus } from '../models/payment.model';

export interface PaymentRepository {
  create(payment: Payment): Promise<void>;
  update(paymentId: string, status: PaymentStatus): Promise<Payment | null>;
  findByPaymentId(paymentId: string): Promise<Payment | null>;
}
