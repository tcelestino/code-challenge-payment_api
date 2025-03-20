const { v4: uuidv4 } = require('uuid');

let currentTxId = uuidv4();

const randomId = () => {
  setInterval(() => {
    currentTxId = uuidv4();
  }, 1000);
  return currentTxId;
};

module.exports = {
  payment: {
    tx_id: randomId(),
    status: 'pending',
  },
};
