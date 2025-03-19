import { PaymentMethod, PaymentStatus } from '../models/payment.model';

export interface CreatePaymentDTO {
  amount: number;
  currency: string;
  method: PaymentMethod;
  productId: string;
}

export interface PaymentResponseDTO {
  paymentId: string;
  status: PaymentStatus;
}

export interface PaymentService {
  createPayment(data: CreatePaymentDTO): Promise<PaymentResponseDTO>;
  getPaymentById(paymentId: string): Promise<PaymentResponseDTO>;
  updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<void>;
}
