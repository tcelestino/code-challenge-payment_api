const { v4: uuidv4 } = require('uuid');

module.exports = {
  payment: {
    tx_id: uuidv4(),
    status: 'pending',
  },
};
