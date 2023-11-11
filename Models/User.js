const { model, Schema } = require('mongoose');

module.exports = model('User',
  new Schema({
    _id: {
      type: String,
      required: true
    },
    economy: {
      sapphire: {
        type: Number,
        default: 0
      },
      points: {
        '2048': {
          type: Number,
          default: 0
        },
        tictactoe: {
          type: Number,
          default: 0
        },
        wordle: {
          type: Number,
          default: 0
        },
        uno: {
          type: Number,
          default: 0
        },
        hangman: {
          type: Number,
          default: 0
        },
        angrama: {
          type: Number,
          default: 0
        },
        'connect4': {
          type: Number,
          default: 0
        }
      }
    }
  })
);