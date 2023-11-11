const { model, Schema } = require('mongoose');

module.exports = model('rpg',
  new Schema({
    _id: { type: String, required: true },
    nickname: String,
    guild: { type: String, required: false },
    class: Number,
    gender: Number,
    max: {
      life: { type: Number, default: 100 },
      xp: { type: Number, default: 1000 },
      stamina: { type: Number, default: 1 },
      mana: { type: Number, default: 1 }
    },
    bars: {
      life: { type: Number, default: 100 },
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 0 },
      stamina: { type: Number, default: 1 },
      mana: { type: Number, default: 0 }
    },
    inventory: { type: Object, default: {} },
    skills: {
      all: { type: Array, default: [] },
      points: { type: Number, default: 0 }
    },
    stats: {
      demage: { type: Number, default: 0 },
      speed: { type: Number, default: 0 },
      critical: { type: Number, default: 0 },
      dps: { type: Number, default: 0 },
      effect: { type: Object, default: {} }
    },
    traits: {
      strength: { type: Number, default: 0 },
      resistance: { type: Number, default: 0 },
      agility: { type: Number, default: 0 },
      brain: { type: Number, default: 0 },
      detection: { type: Number, default: 0 },
      person: { type: Number, default: 0 }
    },
    armor: {
      level: { type: Number, default: 1 },
      ore: { type: Number, default: 0 }
    },
    coins: { type: Number, default: 0 },
    resistance: {
      fire: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      ray: { type: Number, default: 0 },
      poison: { type: Number, default: 0 },
      ground: { type: Number, default: 0 }
    }
  }, { strict: false })
)