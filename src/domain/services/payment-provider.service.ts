export interface InitiatePaymentRequest {
  money: {
    amount: number;
    currency: string;
  };
  payment_method: string;
  product_id: string;
}

export interface InitiatePaymentResponse {
  tx_id: string;
  status: string;
}

export interface GetPaymentResponse {
  tx_id: string;
  status: string;
}

export interface PaymentProviderService {
  initiatePayment(request: InitiatePaymentRequest): Promise<InitiatePaymentResponse>;
  getPayment(paymentId: string): Promise<GetPaymentResponse>;
}
