const { model, Schema } = require('mongoose');

module.exports = model('User',
  new Schema({
    _id: { type: String, required: true },
    economy: {
      sapphire: { type: Number, default: 0 },
      bitcoin: { type: Number, required: false },
      ethereum: { type: Number, required: false },
      litecoin: { type: Number, required: false }
    }
  })
);
