const { v4: uuidv4 } = require('uuid');

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
          body: {
            tx_id: uuidv4(),
            status: 'pending',
          },
        },
      },
    ],
  },
];
