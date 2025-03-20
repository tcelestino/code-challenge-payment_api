const { payment } = require('../fixtures/payment');

module.exports = [
  {
    id: 'create-payment',
    url: '/initiate-payment',
    method: 'POST',
    variants: [
      {
        id: 'success',
        type: 'json',
        options: {
          status: 201,
          body: payment,
        },
      },
    ],
  },
];
