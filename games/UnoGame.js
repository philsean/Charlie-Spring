const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Collection } = require('discord.js');
const emojis = require('./UnoResources/UnoEmojis');
module.exports = class UnoGame {
  constructor (client) {
    this.client = client;
    this.message = undefined;
    
    this.running = false;
    this.started = false;
      
    this.bolo = [
            ...Array(10).fill(true).map((e, i) => ({ value: i, color: 'blue', emoji: emojis[i].blue })),
            ...Array(10).fill(true).map((e, i) => ({ value: i, color: 'green', emoji: emojis[i].green })),
            ...Array(10).fill(true).map((e, i) => ({ value: i, color: 'red', emoji: emojis[i].red })),
            ...Array(10).fill(true).map((e, i) => ({ value: i, color: 'yellow', emoji: emojis[i].yellow })),

            ...Array(9).fill(true).map((e, i) => ({ value: i + 1, color: 'blue', emoji: emojis[i + 1].blue })),
            ...Array(9).fill(true).map((e, i) => ({ value: i + 1, color: 'green', emoji: emojis[i + 1].green })),
            ...Array(9).fill(true).map((e, i) => ({ value: i + 1, color: 'red', emoji: emojis[i + 1].red })),
            ...Array(9).fill(true).map((e, i) => ({ value: i + 1, color: 'yellow', emoji: emojis[i + 1].yellow })),

            ...Array(2).fill(true).map(() => ({ value: 'block', color: 'blue', emoji: emojis.block[0] })),
            ...Array(2).fill(true).map(() => ({ value: 'block', color: 'red', emoji: emojis.block[2] })),
            ...Array(2).fill(true).map(() => ({ value: 'block', color: 'green', emoji: emojis.block[1] })),
            ...Array(2).fill(true).map(() => ({ value: 'block', color: 'yellow', emoji: emojis.block[3] })),

            ...Array(2).fill(true).map(() => ({ value: 'reverse', color: 'blue', emoji: emojis.reverse[0] })),
            ...Array(2).fill(true).map(() => ({ value: 'reverse', color: 'red', emoji: emojis.reverse[2] })),
            ...Array(2).fill(true).map(() => ({ value: 'reverse', color: 'green', emoji: emojis.reverse[1] })),
            ...Array(2).fill(true).map(() => ({ value: 'reverse', color: 'yellow', emoji: emojis.reverse[3] })),

            ...Array(2).fill(true).map(() => ({ value: 'plus_two', color: 'blue', emoji: emojis.plus_two[0] })),
            ...Array(2).fill(true).map(() => ({ value: 'plus_two', color: 'red', emoji: emojis.plus_two[2] })),
            ...Array(2).fill(true).map(() => ({ value: 'plus_two', color: 'green', emoji: emojis.plus_two[1] })),
            ...Array(2).fill(true).map(() => ({ value: 'plus_two', color: 'yellow', emoji: emojis.plus_two[3] })),

            ...Array(4).fill(true).map(() => ({ value: 'plus_four', emoji: emojis.plus_four })),
            ...Array(4).fill(true).map(() => ({ value: 'changeColor', emoji: emojis.changeColor }))
    ].sort(() => 0.5 - Math.random());
      
    this.mesa = [];
    this.users = new Collection();
    this.position = 0;
    this.rotate = false;
  }
  
  
}