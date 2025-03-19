import { config } from '@config/environment';
import { PaymentMethod, PaymentStatus } from '@domain/models/payment.model';
import nock from 'nock';
import supertest from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createServer } from '../../../../../src/server';

vi.mock('@domain/repositories/payment.repository', () => ({
  create: vi.fn(),
  update: vi.fn(),
  findByPaymentId: vi.fn().mockResolvedValue({}),
}));

describe('Payment Routes', () => {
  let app: any;
  let request: any;
  const baseUrl = config.externalService.url;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();
    request = await supertest(app.server);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    nock.cleanAll();
    vi.clearAllMocks();
  });

  afterEach(() => {
    expect(nock.isActive()).toBeTruthy();
  });

  describe('POST /payments', () => {
    // FIX: adjust to use `paymentRepository.create`
    it.skip('should create a payment successfully', async () => {
      const mockPaymentId = '123e4567-e89b-12d3-a456-426614174001';
      nock(baseUrl).post('/initiate-payment').reply(201, {
        tx_id: mockPaymentId,
        status: 'pending',
      });

      const paymentData = {
        amount: 100,
        currency: 'BRL',
        method: PaymentMethod.PAYPAL,
        product_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const response = await request.post('/api/v1/payments').send(paymentData).expect(201);

      expect(response.body).toEqual({
        paymentId: mockPaymentId,
        status: PaymentStatus.PENDING,
      });
    });

    it('should return 400 for invalid payment data', async () => {
      const invalidPaymentData = {
        currency: 'USD',
        method: PaymentMethod.CREDIT_CARD,
        product_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const response = await request.post('/api/v1/payments').send(invalidPaymentData).expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('error', 'Error');
      expect(response.body).toHaveProperty('message');
    });

    it('should handle external service errors', async () => {
      nock(baseUrl).post('/initiate-payment').reply(500, { error: 'External service error' });

      const paymentData = {
        amount: 100,
        currency: 'USD',
        method: PaymentMethod.CREDIT_CARD,
        product_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const response = await request.post('/api/v1/payments').send(paymentData).expect(500);

      expect(response.body).toHaveProperty('statusCode', 500);
      expect(response.body).toHaveProperty('error', 'Payment Provider Error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /payments/:paymentId', () => {
    //FIX: adjust to use `paymentRepository.findByPaymentId`
    it.skip('should return a payment when found', async () => {
      const paymentId = '123e4567-e89b-12d3-a456-426614174002';

      nock(baseUrl).get(`/list-payment/${paymentId}`).reply(200, {
        tx_id: paymentId,
        status: 'processed',
      });

      const response = await request.get(`/api/v1/payments/${paymentId}`).expect(200);

      expect(response.body).toEqual({
        paymentId: paymentId,
        status: PaymentStatus.PROCESSED,
      });
    });

    it('should return 404 when payment not found', async () => {
      const nonExistentPaymentId = '123e4567-e89b-12d3-a456-426614174999';

      nock(baseUrl).get(`/list-payment/${nonExistentPaymentId}`).reply(404, {
        error: 'Payment not found',
      });

      const response = await request.get(`/api/v1/payments/${nonExistentPaymentId}`).expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body.message).toContain(`Payment with ID ${nonExistentPaymentId} not found`);
    });
  });
});
