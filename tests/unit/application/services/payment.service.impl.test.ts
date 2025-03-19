import { PaymentServiceImpl } from '@application/services/payment.service.impl';
import { PaymentNotFoundError } from '@domain/errors/payment-not-found.error';
import { PaymentMethod, PaymentStatus } from '@domain/models/payment.model';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe.only('PaymentServiceImpl', () => {
  let paymentService: PaymentServiceImpl;
  let mockPaymentRepository: any;
  let mockPaymentProviderService: any;

  beforeEach(() => {
    mockPaymentRepository = {
      create: vi.fn(),
      update: vi.fn(),
      findByPaymentId: vi.fn(),
    };

    mockPaymentProviderService = {
      initiatePayment: vi.fn(),
      getPayment: vi.fn(),
    };

    paymentService = new PaymentServiceImpl(mockPaymentRepository, mockPaymentProviderService);
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const paymentData = {
        amount: 100,
        currency: 'USD',
        method: PaymentMethod.CREDIT_CARD,
        productId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const mockProviderResponse = {
        tx_id: '123e4567-e89b-12d3-a456-426614174001',
        status: 'pending',
      };

      mockPaymentProviderService.initiatePayment.mockResolvedValue(mockProviderResponse);
      mockPaymentRepository.create.mockResolvedValue({
        id: 1,
        ...paymentData,
        paymentId: mockProviderResponse.tx_id,
        status: PaymentStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await paymentService.createPayment(paymentData);

      expect(result).toEqual({
        paymentId: mockProviderResponse.tx_id,
        status: PaymentStatus.PENDING,
      });
    });

    it('should throw an error if payment provider fails', async () => {
      const paymentData = {
        amount: 100,
        currency: 'USD',
        method: PaymentMethod.CREDIT_CARD,
        productId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const error = new Error('Payment processing failed');
      mockPaymentProviderService.initiatePayment.mockRejectedValue(error);

      await expect(paymentService.createPayment(paymentData)).rejects.toThrow(error);
      expect(mockPaymentRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getPaymentById', () => {
    it('should return payment when found', async () => {
      const paymentId = '123e4567-e89b-12d3-a456-426614174001';
      const mockPayment = {
        id: 1,
        amount: 100,
        currency: 'USD',
        method: PaymentMethod.PAYPAL,
        productId: '123e4567-e89b-12d3-a456-426614174000',
        paymentId,
        status: PaymentStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPaymentRepository.findByPaymentId.mockResolvedValue(mockPayment);
      mockPaymentProviderService.getPayment.mockResolvedValue({
        tx_id: paymentId,
        status: 'processed',
      });

      const result = await paymentService.getPaymentById(paymentId);

      expect(result).toEqual({
        paymentId,
        status: PaymentStatus.PROCESSED,
      });
      expect(mockPaymentRepository.update).toHaveBeenCalledWith(paymentId, PaymentStatus.PROCESSED);
    });

    it('should throw PaymentNotFoundError when payment not found', async () => {
      const paymentId = '123e4567-e89b-12d3-a456-426614174001';
      mockPaymentRepository.findByPaymentId.mockResolvedValue(null);

      await expect(paymentService.getPaymentById(paymentId)).rejects.toThrow(PaymentNotFoundError);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status successfully', async () => {
      const paymentId = '123e4567-e89b-12d3-a456-426614174001';
      const status = PaymentStatus.PROCESSED;

      mockPaymentRepository.update.mockResolvedValue({
        id: 1,
        amount: 100,
        currency: 'USD',
        method: PaymentMethod.CREDIT_CARD,
        productId: '123e4567-e89b-12d3-a456-426614174000',
        paymentId,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await paymentService.updatePaymentStatus(paymentId, status);

      expect(mockPaymentRepository.update).toHaveBeenCalledWith(paymentId, status);
    });
  });
});
