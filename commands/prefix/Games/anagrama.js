const Game = require('../../../games/Anagram');
const emojis = {
  x: '<:STL_X:1129745080413069412>',
  portal: '<:STL_portal:1130107785229631648>'
}
module.exports = {
  structure: {
    name: 'anagrama',
    description: 'Descubra qual a palavra que está embaralhada.',
    aliases: ['anagram', 'shuffle']
  },
  run: async (client, message, args) => {
    if (client.games.anagrama.get(message.channel.id)) {
      await message.reply({ content: `( ${emojis.x} ) › Já tem uma partida rodando neste canal.` });
      return;
    };

    message.reply({ content: `( ${emojis.portal} ) › O jogo irá começar em alguns segundos.` }).then((msg) => {
      setTimeout(() => {
        let game = new Game();
        client.games.anagrama.set(message.channel.id, {
          game: game,
          run: true,
          users: new Map().set(message.author.id, { points: 0 })
        });
        let embed = {
          color: 0x5865f2,
          title: '( 🔡 ) › Adivinhe o anagrama',
          description: game.anagram.emoji.join(' '),
          footer: { text: 'Envie a mensagem no chat para responder.' }
        };

        msg.reply({ embeds: [embed] });

        game.interval = setInterval(() => {
          // END GAME
        }, 65000);

        let filter = m => !m.author.bot;
        const collector = message.channel.createMessageCollector({ filter: filter });

        let idle = setTimeout(() => {
          let gm = client.games.anagrama.get(message.channel.id);
          if (!gm?.run) return;

          collector.stop('idle')
        }, 65000);

        collector.on('collect', (m) => {
          game = client.games.anagrama.get(message.channel.id);
          if (!game.run) return;
          if (!m.content.toLowerCase().includes(game.game.word)) {
            clearInterval(game.interval);

            game.interval = setInterval(() => {
              // END GAME
            }, 65000);

            return;
          };

          if (!game.users.has(m.author.id)) game.users.set(m.author.id, { points: 1 })
          else game.users.get(m.author.id).points += 1;

          try { m.react('✅'); } catch (err) { }

          let medals = {
            0: '🥇',
            1: '🥈',
            2: '🥉'
          }

          let eb = {
            color: 0x5865f2,
            title: `( 🏆 ) › Pontuações`,
            description: Array.from(game.users).sort((a, b) => b[1].points - a[1].points).slice(0, 3).map((u, indice) => `**[ ${medals[indice]} ] ›** <@${u[0]}> **-** \`(${u[1].points})\` `).join('\n')
          }
          m.channel.send({ content: '( 🔄 ) › Próximo anagrama em alguns segundos.', embeds: [eb] });
          game.run = false;
          client.games.anagrama.set(message.channel.id, game);
          clearTimeout(idle)
          idle = setTimeout(() => {
            let newGame = new Game();
            embed = {
              color: 0x5865f2,
              title: '( 🔡 ) › Adivinhe o anagrama',
              description: newGame.anagram.emoji.join(' '),
              footer: { text: 'Envie a mensagem no chat para responder.' }
            };

            message.channel.send({ embeds: [embed] });
            game.game = newGame;
            game.run = true;
            client.games.anagrama.set(message.channel.id, game);
            setTimeout(() => {
              let gm = client.games.anagrama.get(message.channel.id);
              if (!gm?.run) return;

              collector.stop('idle')
            }, 65000);
          }, 10000);
        });
        collector.on('end', (_, rs) => {
          game = client.games.anagrama.get(message.channel.id);
          if (rs === 'idle') {
            clearTimeout(idle);
            let medals = {
              0: '🥇',
              1: '🥈',
              2: '🥉'
            }

            let ebm = {
              color: 0x5865f2,
              title: `( 🏆 ) › Pontuações`,
              description: Array.from(game.users).sort((a, b) => b[1].points - a[1].points).slice(0, 3).map((u, indice) => `**[ ${medals[indice]} ] ›** <@${u[0]}> **-** \`(${u[1].points})\` `).join('\n')
            }
            message.channel.send({ content: `( ⌛ ) › Tempo esgotado. A palavra era... \`${game.game.word}\``, embeds: [ebm] });
          }

          client.games.anagrama.delete(message.channel.id);
        });
      }, 10000);
    });
  }
                                                   }