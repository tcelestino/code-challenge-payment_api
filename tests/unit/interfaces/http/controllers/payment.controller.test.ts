import { PaymentNotFoundError } from '@domain/errors/payment-not-found.error';
import { PaymentMethod, PaymentStatus } from '@domain/models/payment.model';
import { PaymentController } from '@interfaces/http/controllers/payment.controller';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let mockPaymentService: any;
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    mockPaymentService = {
      createPayment: vi.fn(),
      getPaymentById: vi.fn(),
    };

    paymentController = new PaymentController(mockPaymentService);

    mockReply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      mockRequest = {
        body: {
          amount: 100,
          currency: 'USD',
          method: PaymentMethod.CREDIT_CARD,
          productId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      const mockPaymentResponse = {
        paymentId: '123e4567-e89b-12d3-a456-426614174001',
        status: PaymentStatus.PENDING,
      };

      mockPaymentService.createPayment.mockResolvedValue(mockPaymentResponse);

      await paymentController.createPayment(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith(mockPaymentResponse);
    });

    it('should handle errors during payment creation', async () => {
      mockRequest = {
        body: {
          amount: 100,
          currency: 'USD',
          method: PaymentMethod.CREDIT_CARD,
          productId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      const error = new Error('Payment creation failed');
      mockPaymentService.createPayment.mockRejectedValue(error);

      await expect(
        paymentController.createPayment(mockRequest as any, mockReply as any),
      ).rejects.toThrow(error);
    });
  });

  describe('getPaymentById', () => {
    it('should return payment when found', async () => {
      const paymentId = '123e4567-e89b-12d3-a456-426614174001';
      const mockRequest = {
        params: { paymentId },
      };

      const mockPaymentResponse = {
        paymentId,
        status: PaymentStatus.PROCESSED,
      };

      mockPaymentService.getPaymentById.mockResolvedValue(mockPaymentResponse);

      await paymentController.getPaymentById(mockRequest as any, mockReply as any);

      expect(mockPaymentService.getPaymentById).toHaveBeenCalledWith(paymentId);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockPaymentResponse);
    });

    it('should handle PaymentNotFoundError', async () => {
      const paymentId = '123e4567-e89b-12d3-a456-426614174001';
      const mockRequest = {
        params: { paymentId },
      };

      const error = new PaymentNotFoundError(`Payment with ID ${paymentId} not found`);
      mockPaymentService.getPaymentById.mockRejectedValue(error);

      await expect(
        paymentController.getPaymentById(mockRequest as any, mockReply as any),
      ).rejects.toThrow(PaymentNotFoundError);
    });
  });
});
