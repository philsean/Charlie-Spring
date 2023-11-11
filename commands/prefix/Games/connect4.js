const Game = require('../../../games/connectService');
const { PermissionsBitField } = require('discord.js');
const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];

module.exports = {
  structure: {
    name: 'connect4',
    description: 'Jogue **Connect4** com seu amigo, é um jogo onde você tem que colocar peças até forma uma fileira com 4 peças da mesma cor.',
    aliases: ['c4']

  },
  run: async (client, message, args) => {
    const user = client.findUser(args.join(' '), message);
    if (!args[0] || !user) return message.reply({ content: `(  ) › Você precisa mencionar um usuário para jogar.` });
    if (user.id === message.author.id || user.bot || !message.guild.members.cache.has(user.id)) user = client.user;
    if (client.games.connect4.get(message.author.id)) return message.reply({ content: `(  ) › Você já está em uma partida de Connect4.` });
    if (client.games.connect4.get(user.id)) return message.reply({ content: `(  ) › **${user.globalName || user.username}** já está em uma partida de Connect4.` });
    
      let size = 8;
      let users = {
	   autor: {
		user: message.author,
		color: 'red'
	 },
	   other: {
		user: user.user || user,
		color: 'yellow'
	   }
	};
    const connect = new Game(size, user.id === client.user.id ? ['red', 'yellow'] : false);
    const msg = await message.channel.send({ content: 'Carregando tabuleiro...' });
    const play = (msg, user) => {
      if (user.user.id !== client.user.id) {
        const collector = msg.createReactionCollector({ filter: (r, u) => emojis.includes(r.emoji.name) && u.id === user.user.id, max: 1, time: 120000 })
        .on('collect', async (reaction, u) => {
          if (message.channel.permissionsFor(message.guild.members.me).toArray().indexOf('ManageMessages') !== -1) reaction.users.remove(u.id);
          const { emoji } = reaction;
          const usedNumber = emojis.indexOf(emoji.name);
          const verify = await connect.play(user.color, usedNumber, true);
          if (typeof verify === 'string') {
            setTimeout(() => play(msg, user), 1500);
            return msg.reply({ content: `${user.user}, está casa já está ocupada!` }).then(e => e.delete({ timeout: 5000 }));
          }
          if (typeof verify === 'object') {
            msg.edit({ content: handleBoard(connect.board, user.color === 'red' ? users.other.color : users.autor.color) });
            client.games.connect4.delete(users.autor.user.id);

          client.games.connect4.delete(users.other.user.id);
            return msg.reply({ content: `(  ) › ${user.user} ganhou no Connect4! **(${user.color})**` });
          }
          
          if (!connect.board.filter(board => board.find(e => e === 'x') !== undefined).length) {
            msg.edit({ content: ndleBoard(connect.board, user.color) });
            client.games.connect4.delete(users.autor.user.id);

          client.games.connect4.delete(users.other.user.id);
            return msg.reply({ content: `(  ) › O jogo impatou, que tal uma revanche?` });
          }
            
          msg.edit({ content: handleBoard(connect.board, user.color === 'red' ? users.other.color : users.autor.color) });
          setTimeout(() => play(msg, user.color === 'red' ? users.other : users.autor), 1500);

				
          // msg.reply({ content: reaction.emoji.name });
        })
        .on('end', async (_, reason) => {
          if (reason !== 'limit') {
              client.games.connect4.delete(users.autor.user.id);

client.games.connect4.delete(users.other.user.id);
              return msg.reply({ content: `(  ) › O jogo foi cancelado por inatividade de um dos jogadores.` });
          }
        });
      } else {
        setTimeout(async () => {
          const movement = await connect.getIAMovement();
        }, 2000);
      }
    }
    client.games.connect4.set(message.author.id, true);
    client.games.connect4.set(user.id, true);
    for (let i = 0; i < emojis.slice(0, connect.board.length - 1).length; i++) {
      msg.react(emojis[i]).then(async () => {
	   if (i === emojis.slice(0, connect.board.length - 1).length - 1) {
		await msg.edit(await handleBoard(connect.board, users['autor'].color));
		play(msg, users['autor']);
	   }
      });
    }
  }
}

function handleBoard(board, color) {

		const emojisBoard = {
			'red': '🔴',
			'white': '⚪',
			'yellow': '🟡'
		};

		let msg = emojisBoard[color] + '\n\n' + emojis.slice(0, board.length - 1).join("") + "\n";

		for (var i = 0; i < board.length; i++) {
			msg += board[i].map(e => e !== 'x' ? emojisBoard[e] : emojisBoard.white).join("") + "\n"
		};

		return msg
}