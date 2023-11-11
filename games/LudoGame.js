const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = class LudoGame {
  constructor (message, users) {
    this.message = message;
    this.users = {};
    let colors = ['blue', 'red', 'green', 'yellow'];
    users.shuffle().map((x, i) => this.users[colors[i]] = { id: x, color: colors[i], onLobby: 4, onArrival: 0 });
    this.turn = 'blue';
    this.table = require('./LudoUtils/table');
    this.printTable = () => {
      let _ = {
        b: '🟦',
        r: '🟥',
        g: '🟩',
        y: '🟨',
        w: '⬜',
        B: '🚩',
        p: '⬛'
      };
      let tb = this.table.map(x => x.map(y => _[y] || y).join('')).join('\n');
      // Lobby Blue
      if (this.users.blue) for (let i = 0; i < this.users.blue.onLobby; i++) {
        tb = tb.replace('LB', '🔵');
      }
      // Lobby Red
      if (this.users.red) for (let i = 0; i < this.users.red.onLobby; i++) {
        tb = tb.replace('LR', '🔴');
      }
      // Lobby Green
      if (this.users.green) for (let i = 0; i < this.users.green.onLobby; i++) {
        tb = tb.replace('LG', '🟢');
      }
      // Lobby Yellow
      if (this.users.yellow) for (let i = 0; i < this.users.yellow.onLobby; i++) {
        tb = tb.replace('LY', '🟡');
      }
        
      tb = tb.replaceAll(/LB|LR|LG|LY/g, _['w']);
      
      return tb;
    };
  }
}