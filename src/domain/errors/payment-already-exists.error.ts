export class PaymentAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentAlreadyExistsError';
  }
}
