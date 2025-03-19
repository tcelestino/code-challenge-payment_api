export const createSchemaValidation = {
  type: 'object',
  required: ['amount', 'currency', 'method', 'product_id'],
  properties: {
    amount: { type: 'number' },
    currency: { type: 'string' },
    method: { type: 'string' },
    product_id: { type: 'string' },
  },
};

export const getSchemaValidation = {
  type: 'object',
  required: ['paymentId'],
  properties: {
    paymentId: { type: 'string' },
  },
};
