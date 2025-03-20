const { payment } = require('../fixtures/payment');

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
          body: payment,
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
