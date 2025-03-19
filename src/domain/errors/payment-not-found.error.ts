export class PaymentNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentNotFoundError';
  }
}
