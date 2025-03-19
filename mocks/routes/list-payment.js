const { v4: uuidv4 } = require('uuid');

module.exports = [
  {
    id: 'get-payment',
    url: '/list-payment/:paymentId',
    method: 'GET',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 200,
          body: {
            tx_id: uuidv4(),
            status: 'processed',
          },
        },
      },
      {
        id: 'not-found',
        type: 'json',
        options: {
          status: 404,
          body: {
            message: 'Payment not found',
          },
        },
      },
    ],
  },
];
