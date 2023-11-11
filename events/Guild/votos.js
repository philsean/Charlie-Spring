module.exports = {
  event: 'messageCreate',
  run: async (client, message) => {
    if (message.channel.id !== '1134538519520485376') return;
    if (message.author.id !== '1134155139045933218') return;
    
    let bot = message.embeds[0]?.title;
    if (!bot.includes(client.user.username)) return;
    
    let vote = message.embeds[0]?.footer?.text.split('_'),
    user = client.users.cache.get(vote[0]) || await client.users.fetch(vote[0]),
    msg = null,
    cont = `**<:dcl_eCoracaozin:804037177029427230> › Obrigado!** Por ter votado em mim, você ganhará **${vote[1]} LiteCoins**.`;
    message.guild.channels.cache.map(y => {
      let m = y.messages?.cache.find(x => x.author.id === vote[0] && x.content?.includes('.v'));
      if (m) msg = m;
                                          })
    try {
      if (msg) msg.reply(cont)
      else user.send(cont);
      client.database.addCrypto('litecoin', vote[1] * 1, user.id);
    } catch (err) {
      console.log(err);
    };
  }
}