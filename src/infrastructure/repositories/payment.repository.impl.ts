import { PaymentAlreadyExistsError } from '@domain/errors/payment-already-exists.error';
import { Payment, PaymentStatus } from '@domain/models/payment.model';
import { PaymentRepository } from '@domain/repositories/payment.repository';
import { PaymentModel } from '../database/models/payment.model';

export class PaymentRepositoryImpl implements PaymentRepository {
  async create(payment: Payment): Promise<void> {
    try {
      await PaymentModel.create(payment);
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        throw new PaymentAlreadyExistsError(`Payment with ID ${payment.paymentId} already exists`);
      }
      throw error;
    }
  }

  async findByPaymentId(paymentId: string): Promise<Payment | null> {
    const payment = await PaymentModel.findOne({
      where: { paymentId },
    });

    return payment ? (payment.toJSON() as Payment) : null;
  }

  async update(paymentId: string, status: PaymentStatus): Promise<Payment | null> {
    const existingPayment = await PaymentModel.findOne({
      where: { paymentId, status: PaymentStatus.PENDING },
    });

    if (!existingPayment) {
      return null;
    }
    const updatedPayment = await existingPayment.update({
      status,
      updatedAt: new Date(),
    });

    return updatedPayment;
  }
}
