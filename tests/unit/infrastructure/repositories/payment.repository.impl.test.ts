import { PaymentAlreadyExistsError } from '@domain/errors/payment-already-exists.error';
import { Payment, PaymentMethod, PaymentStatus } from '@domain/models/payment.model';
import { PaymentModel } from '@infrastructure/database/models/payment.model';
import { PaymentRepositoryImpl } from '@infrastructure/repositories/payment.repository.impl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@infrastructure/database/models/payment.model', () => ({
  PaymentModel: {
    create: vi.fn(),
    findOne: vi.fn(),
  },
}));

const mockUpdate = vi.fn();

describe('PaymentRepositoryImpl', () => {
  let paymentRepository: PaymentRepositoryImpl;
  const mockPayment: Payment = {
    amount: 100,
    currency: 'USD',
    method: PaymentMethod.CREDIT_CARD,
    productId: '123e4567-e89b-12d3-a456-426614174000',
    paymentId: '123e4567-e89b-12d3-a456-426614174001',
    status: PaymentStatus.PENDING,
  };

  beforeEach(() => {
    paymentRepository = new PaymentRepositoryImpl();
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payment successfully', async () => {
      const mockCreatedPayment = {
        ...mockPayment,
        id: 1,
        createdAt: new Date('2025-03-18T18:55:00.731Z'),
        updatedAt: new Date('2025-03-18T18:55:00.731Z'),
        toJSON: () => ({
          ...mockPayment,
          id: 1,
          createdAt: new Date('2025-03-18T18:55:00.731Z'),
          updatedAt: new Date('2025-03-18T18:55:00.731Z'),
        }),
      };

      (PaymentModel.create as any).mockResolvedValue(mockCreatedPayment);

      await paymentRepository.create(mockPayment);

      expect(PaymentModel.create).toHaveBeenCalledWith(mockPayment);
      expect(PaymentModel.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if database operation fails', async () => {
      const error = new Error('Database error');
      (PaymentModel.create as any).mockRejectedValue(error);

      await expect(paymentRepository.create(mockPayment)).rejects.toThrow(error);
    });

    it('should throw PaymentAlreadyExistsError when payment with same ID already exists', async () => {
      const sequelizeError = new Error('Unique constraint violation');
      sequelizeError.name = 'SequelizeUniqueConstraintError';
      (PaymentModel.create as any).mockRejectedValue(sequelizeError);

      await expect(paymentRepository.create(mockPayment)).rejects.toThrow(
        PaymentAlreadyExistsError,
      );
      await expect(paymentRepository.create(mockPayment)).rejects.toThrow(
        `Payment with ID ${mockPayment.paymentId} already exists`,
      );
    });
  });

  describe('findByPaymentId', () => {
    it('should return payment when found', async () => {
      const mockFoundPayment = {
        ...mockPayment,
        id: 1,
        createdAt: new Date('2025-03-18T18:55:00.731Z'),
        updatedAt: new Date('2025-03-18T18:55:00.731Z'),
        toJSON: () => ({
          ...mockPayment,
          id: 1,
          createdAt: new Date('2025-03-18T18:55:00.731Z'),
          updatedAt: new Date('2025-03-18T18:55:00.731Z'),
        }),
      };

      (PaymentModel.findOne as any).mockResolvedValue(mockFoundPayment);

      const result = await paymentRepository.findByPaymentId(mockPayment.paymentId);

      expect(PaymentModel.findOne).toHaveBeenCalledWith({
        where: { paymentId: mockPayment.paymentId },
      });
      expect(result).toEqual(mockFoundPayment.toJSON());
    });

    it('should return null when payment not found', async () => {
      (PaymentModel.findOne as any).mockResolvedValue(null);

      const result = await paymentRepository.findByPaymentId(mockPayment.paymentId);

      expect(PaymentModel.findOne).toHaveBeenCalledWith({
        where: { paymentId: mockPayment.paymentId },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update payment status when payment is found and pending', async () => {
      const mockExistingPayment = {
        ...mockPayment,
        id: 1,
        createdAt: new Date('2025-03-18T18:55:00.731Z'),
        updatedAt: new Date('2025-03-18T18:55:00.731Z'),
        update: mockUpdate,
      };

      const updatedPayment = {
        ...mockExistingPayment,
        status: PaymentStatus.PROCESSED,
        updatedAt: new Date('2025-03-18T19:00:00.731Z'),
      };

      (PaymentModel.findOne as any).mockResolvedValue(mockExistingPayment);
      mockUpdate.mockResolvedValue(updatedPayment);

      const result = await paymentRepository.update(mockPayment.paymentId, PaymentStatus.PROCESSED);

      expect(PaymentModel.findOne).toHaveBeenCalledWith({
        where: { paymentId: mockPayment.paymentId, status: PaymentStatus.PENDING },
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        status: PaymentStatus.PROCESSED,
        updatedAt: expect.any(Date),
      });
      expect(result).toEqual(updatedPayment);
    });

    it('should return null when payment is not found', async () => {
      (PaymentModel.findOne as any).mockResolvedValue(null);

      const result = await paymentRepository.update(mockPayment.paymentId, PaymentStatus.PROCESSED);

      expect(PaymentModel.findOne).toHaveBeenCalledWith({
        where: { paymentId: mockPayment.paymentId, status: PaymentStatus.PENDING },
      });
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should throw an error if database operation fails during update', async () => {
      const mockExistingPayment = {
        ...mockPayment,
        id: 1,
        update: mockUpdate,
      };

      const error = new Error('Database update error');
      (PaymentModel.findOne as any).mockResolvedValue(mockExistingPayment);
      mockUpdate.mockRejectedValue(error);

      await expect(
        paymentRepository.update(mockPayment.paymentId, PaymentStatus.PROCESSED),
      ).rejects.toThrow(error);
      expect(PaymentModel.findOne).toHaveBeenCalledWith({
        where: { paymentId: mockPayment.paymentId, status: PaymentStatus.PENDING },
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        status: PaymentStatus.PROCESSED,
        updatedAt: expect.any(Date),
      });
    });
  });
});
