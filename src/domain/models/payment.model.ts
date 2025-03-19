export enum PaymentMethod {
  PAYPAL = 'PAYPAL',
  CREDIT_CARD = 'CREDIT_CARD',
  PIX = 'PIX',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  CANCELED = 'CANCELED',
}

export interface Payment {
  id?: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  productId: string;
  paymentId: string;
  status: PaymentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
