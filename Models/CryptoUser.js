const { model, Schema } = require('mongoose');

module.exports = model('GuildSchema',
  new Schema({
    _id: String,
    bitcoin: { type: Number, required: false },
    ethereum: { type: Number, required: false },
    litecoin: { type: Number, required: false }
  });
);
