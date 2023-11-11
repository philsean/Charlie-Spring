const Game = require('../../../games/MatchingGame');

module.exports = {
  structure: {
    name: 'jogodamemória',
    description: 'Memorize e descubra as casas iguais do ***Jogo da Memória**.',
    aliases: ['memory', 'matching', 'memória', 'jdm'],
    args: [{ name: 'usuário', required: true }],
    developer: true
  },
  run: async (client, message, args) => {
    let size = Number(args[0]);
    if (!size || isNaN(size) || size < 1 || size > 5) return message.reply({ content: `( ${client.emoji['STL_X']} ) › Você deve colocar o tamanho de maneira correta, um número entre **1 - 5**.` });
    args.shift();
      
    let user = client.findUser(args.join(' '), message);
    if (!user || !message.guild.members.cache.has(user.id) || user.bot) return message.reply({ content: `( ${client.emoji['STL_X']} ) › Me diga para qual usuário você quer jogar contra, lembre-se que este usuário precisa estar no servidor.` });
      
    
    client.games.matching.set(user.id, { inGame: message.author.id });
    let msg = await message.reply({ content: `A partida se iniciará em alguns segundos...` });
    let game = new Game(client, msg, size, null, [message.author, user]);

    client.games.matching.set(message.author.id, game);
    setTimeout(() => {
      game = client.games.matching.get(message.author.id);
      game.start();
    }, 6000);
  }
};
