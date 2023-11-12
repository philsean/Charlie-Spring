const { model, Schema } = require('mongoose');

module.exports = model('crypto',
  new Schema({
    _id: String,
    bolsa: {
      bitcoin: { type: Array, default: [ 136466 ] },
      ethereum: { type: Array, default: [ 27399 ] },
      litecoin: { type: Array, default: [ 3545 ] }
    }
  })
);
