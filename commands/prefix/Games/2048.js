const { ComponentType, ButtonBuilder, ButtonStyle, ActionRowBuilder, Message, PermissionFlagBits } = require('discord.js');
const Client = require('../../../class/ExtendedClient');
const config = require('../../../config');
const Game = require('../../../games/2048');
  
let emojis = {
  x: '<:STL_X:1129745080413069412>',
  numbers: [
  {
    value: 0,
    name: '<:0_:1145078584084549652>',
    id: '1145078584084549652'
  },
  {
    value: 2,
    name: '<:2_:1145078567059857519>',
    id: '1145078567059857519'
  },
  {
    value: 4,
    name: '<:4_:1145078568947286036>',
    id: '1145078568947286036'
  },
  {
    value: 8,
    name: '<:8_:1145078569857450116>',
    id: '1145078569857450116'
  },
  {
    value: 16,
    name: '<:16:1145078568041320448>',
    id: '1145078568041320448'
  },
  {
    value: 32,
    name: '<:32:1145078581832192060>',
    id: '1145078581832192060'
  },
  {
    value: 64,
    name: '<:64:1145078577960861837>',
    id: '1145078577960861837'
  },
  {
    value: 128,
    name: '<:128:1145078576891310220>',
    id: '1145078576891310220'
  },
  {
    value: 256,
    name: '<:256:1145078570985734266>',
    id: '1145078570985734266'
  },
  {
    value: 512,
    name: '<:512:1145078571992371281>',
    id: '1145078571992371281'
  },
  {
    value: 1024,
    name: '<:1024:1145078574722859128>',
    id: '1145078574722859128'
  },
  {
    value: 2048,
    name: '<:2048:1145078582889168936>',
    id: '1145078582889168936'
  },
  {
    value: 4096,
    name: '<:4096:1145078575876296784>',
    id: '1145078575876296784'
  },
  {
    value: 8192,
    name: '<:8192:1145078573523271720>',
    id: '1145078573523271720'
  }
]
};

module.exports = {
  structure: {
    name: '2048',
    description: 'Um jogo onde você vai somando números iguais até que forme 2048.',
    aliases: ['doismilequarentaeoito'],
  },
  run: async (client, message, args) => {
    /* if (config.users.developers.indexOf(message.author.id) === -1) {
      await message.reply({ content: `( ${emojis.x} ) › Você não pode utilizar este comando.` });
      return;
    } */

    if (client.games['2048'].get(message.author.id)) {
      await message.reply({ content: `( ${emojis.x} ) › Já tem uma partida sua rodando.` });
      return;
    }

    let game = new Game(4);
    game.addCard();
    game.addCard();

    let directs = ['left', 'up', 'down', 'right'];
    let boardR = gameResolve(game);
    let row = new ActionRowBuilder().setComponents(['⬅️', '⬆️', '⬇️', '➡️'].map((y, i) => new ButtonBuilder().setCustomId(`${directs[i]}`).setStyle(ButtonStyle.Primary).setEmoji(`${y}`)));
    
    await message.reply({ content: boardR, components: [row] }).then((send) => {
      client.games['2048'].set(message.author.id, { game: game, message: send.id });
      
      const collector = send.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 * 15 });

      collector.on('collect', i => {
        if (i.user.id !== message.author.id) return i.reply({ content: `( ${emojis.x} ) › Esses botões não são para você!`, ephemeral: true });

        game = client.games['2048'].get(message.author.id);
        if (!game) return;
        
        let move = {
          up: i.customId === 'up',
          down: i.customId === 'down',
          left: i.customId === 'left',
          right: i.customId === 'right',
        };

        game.game.play(move.up, move.down, move.right, move.left);
        game.game.addCard();
        i.update({ content: gameResolve(game.game) });
      });
      collector.on('end', () => {
        client.games['2048'].delete(message.author.id)
      })
    });
  }
}

function gameResolve (game) {
  return game.board.map((x, i) => x.map((y, l) => emojis.numbers.find(e => e.value == y)?.name).join('')).join('\n');
}