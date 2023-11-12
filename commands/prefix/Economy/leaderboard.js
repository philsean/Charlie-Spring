const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
  structure: {
    name: 'leaderboard',
    description: 'Veja o ranking dos mais ricos na minha economia.',
    aliases: ['rank', 'ranking', 'lb', 'rk']
  },
  run: async (client, message, args) => {
    let leaderboard = await client.database.getLeaderboard();
    let lb = [];
    leaderboard.leaderboard.slice(0, 10).map(async ({ _id, economy }, i) => {
      let u = client.users.cache.get(_id) || await client.users.fetch(_id);
      lb.push(`**[ ${i + 1} ] › ${u.globalName + ` \`( ${u.username} )\`` || u.username}** — ${(economy.sapphire || 0).toLocaleString('pt-br')} Sapphires`)
    });
    let embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setThumbnail(`https://cdn.discordapp.com/emojis/998070129504043088.png`)
      .setTitle(`${client.emoji.sapphire} › Sapphires | Leaderboard`)
      .setDescription(lb.filter(y => y !== undefined).join('\n'))
    
    message.reply({ embeds: [embed] });
  }
}
