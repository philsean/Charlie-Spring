const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  structure: {
    name: 'daily',
    description: 'Resgate sua recompensa diária.',
    aliases: ['diária', 'dl']
  },
  run: async (client, message, args) => {
    let cld = await client.database.getCooldown(message.author, 'daily');
    let amount = Math.floor(Math.random() * (600 - 400)) + 400;
    if (cld > Date.now()) return message.reply({ content: `**( ${client.emoji.cooldown} ) › Calma lá!** Espere mais **${ms(cld - Date.now(), { long: true })}** para resgatar sua recompensa diária novamente.` });
    await client.database.setCooldown(message.author, 'daily');
    client.database.setMoney(message.author, amount);
    message.reply({ embeds: [{
      color: 0x5865f2,
      title: `( ${client.emoji.daily} ) › Recompensa Diária`,
      description: `> Você resgatou sua *Recompensa Diária* de **${amount.toLocaleString('pt-BR')} Sapphires** hoje, volte em ***24 horas*** para resgatar novamente.`
    }] });
  }
}