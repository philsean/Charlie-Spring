module.exports = {
  structure: {
    name: 'saldo',
    description: 'Veja a quantidade de ***Saphire*** você conseguiu acumular até agora.',
    aliases: ['sapphire', 'atm', 'bal'],
    args: [{
      name: 'usuário',
      required: false
    }]
  },
  run: async (client, message, args, db) => {
    let user = client.findUser(args.join(' '), message);
    user = user.id === client.user.id ? message.author : user;
    let data = await client.database.getLeaderboard();
    let dataU = data.leaderboard.find(x => x._id === user.id);
    let money = dataU?.economy?.sapphire || 0;

    message.reply({ content: `( ${client.emoji.sapphire} ) › ${message.author}, ${message.author.id === user.id ? 'você' : `**${user.globalName || user.username}**`} possui **${money.toLocaleString('pt-br')} Sapphire(s)**, e está na posição **#${data.indexOf(dataU) >= 0 ? data.indexOf(dataU) + 1 : '+100'}** no ranking.` });
  }
}
