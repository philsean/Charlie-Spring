const { model, Schema } = require('mongoose');

module.exports = model('crypto',
  new Schema({
    _id: String,
    bolsa: {
      bitcoin: { type: [[Number]], default: [ 136466 ] },
      ethereum: { type: [[Number]], default: [ 27399 ] },
      litecoin: { type: [[Number]], default: [ 3545 ] }
    }
  })
);
