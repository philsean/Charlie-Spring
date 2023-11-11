const { EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = {
  structure: {
    name: 'first',
    description: 'Veja qual foi a primeira mensagem do canal.',
    aliases: ['primeiro']
  },
  run: async (client, message, args) => {
    let channel = message.mentions.channels.first() || message.channel;
    if (!channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.ViewChannel) || !channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.ReadMessageHistory)) return message.error({ content: 'parece que eu não tenho permissão para ver o histórico deste canal.', emoji: '😶‍🌫️' });
    let msg = await message.reply({ content: 'Procurando...' });
    await channel.messages.fetch({ limit: 100, around: channel.createdTimestamp });
    let messages = channel.messages.cache;
    // let finded = messages.map(x => x).sort((a, b) => b.createdTimestamp + a.createdTimestamp)[0];
    msg.delete().catch(() => 0);
    // messages.get(finded.id)
    let m = messages.last();    
    if (channel.id === message.channel.id) m.reply({ content: `( 😶‍🌫️ ) › Esta é a primeira mensagem do canal. [Clique aqui](https://discord.com/channels/${message.guild.id}/${channel.id}/${m.id}) \`[ Este comando só carrega 100 mensagens ]\``, allowedMentions: { repliedUser: false } })
    else message.channel.send({ content: `( 😶‍🌫️ ) › Esta é a primeira mensagem do canal. [Clique aqui](https://discord.com/channels/${message.guild.id}/${channel.id}/${m.id}) \`[ Este comando só carrega 100 mensagens ]\`` });
  }
      }
