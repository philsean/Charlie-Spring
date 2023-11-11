const { log } = require("../../functions");
const Client = require('../../class/ExtendedClient');

module.exports = {
  event: 'ready',
  once: true,
  run: async (_, client) => {
    log('Logado em: ' + client.user.tag, 'done');
    let user = await client.users.fetch('916712541797896263');
    // user.send({ content: `( ✏️ ) › Fui reiniciando e parece que tem coisa nova no código. ( <t:${~~(Date.now() / 1000)}:F> )` });
    let guilds = ['1077563002733219962', '995335063975768115', '985625402288529449', '1146220629230633071'];
    
    guilds.forEach(async (id) => {
      let guild = await client.guilds.fetch(id);
      if (!guild) return;
      // client.guilds.cache.set(id, guild);
      client.guilds.cache.get(id)?.emojis.cache.map((e) => client.emoji[e.name] = `${e}`);
    });
  }
};
