const { EmbedBuilder } = require('discord.js');
const { convertMS } = require('../../../functions');
const os = require('os');

module.exports = {
  structure: {
    name: 'botinfo',
    description: 'Veja as informações do bot.',
    aliases: ['infobot', 'bt', 'bi']
  },
  run: async (client, message, args) => {
    let owner = '916712541797896263';
    owner = client.users.cache.get(owner) || await client.users.fetch(owner);
    let u = convertMS(client.uptime);
    let ontime = `${u.d} Dia(s), ${u.h} Hora(s), ${u.m} Minuto(s) e ${u.s} Segundo(s)`;
     
    let embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: '› ' + client.user.username + ' | Informações', iconURL: client.user.displayAvatarURL() })
      .setDescription(`${client.emoji['bunny_grin']} Olá novamente internauta, eu sou a **${client.user.username}**! Sou uma bot com algumas diversas funções, mas focada em jogos e economia \`( mesmo que aja poucos comandos )\`. Veja algumas das minhas informações abaixo:\n## ( ${client.emoji.colab} ) › Créditos\n>>> **${owner.globalName ? owner.globalName + ` \`( ${owner.username} )\`` : owner.username}** — Desenvolvedor.\n**${credit.globalName ? credit.globalName + ` \`( ${credit.username} )\`` : credit.username}** — Códigos do seu bot **SwiftBOT**.`)
      .addFields({
        name: `${client.emoji.statistics} › Estatísticas`,
        value: `>>> **Servidores:** \`${(client.guilds.cache.size).toLocaleString('pt-BR')}\`\n**Membros:** \`${(client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a+b, 0)).toLocaleString('pt-BR')}\`\n**Canais:** \`${(client.channels.cache.size).toLocaleString('pt-BR')}\``
      }, {
        name: `${client.emoji.hosting} › Host`,
        value: `>>> **Processador:** \`${os.cpus()[0].model} ${os.cpus().length} vCore\`\n**Memória RAM:** \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(0).toLocaleString('pt-BR')} MB/${(os.totalmem() / 1024 / 1024).toFixed(0).toLocaleString('pt-BR')} MB\`\n**CPU:** \`${os.loadavg()[0]}%\``
      }, {
        name: `${client.emoji.web_i}› Outras Informações`,
        value: `>>> **Linguagem:** [Javascript](https://js.org/) | [NodeJS](https://nodejs.org/)\n**Livraria:** [Discord.js](https://discord.js.org/)\n**Database:** [MongoDB](https://www.mongodb.com/) | [Mongoose](https://npmjs.com/package/mongoose)\n**Uptime:** \`${ontime}\``
      })
    
    message.reply({ embeds: [embed] });
  }
}
