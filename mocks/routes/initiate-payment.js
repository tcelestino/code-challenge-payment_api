const { v4: uuidv4 } = require('uuid');

module.exports = [
  {
    id: 'create-payment',
    url: '/initiate-payment',
    method: 'POST',
    variants: [
      {
        id: 'success',
        type: 'middleware',
        options: {
          middleware: (req, res, next, core) => {
            res.status(201).json({ tx_id: uuidv4(), status: 'pending' });
          },
        },
      },
    ],
  },
];
