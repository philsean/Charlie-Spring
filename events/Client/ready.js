const { log } = require("../../functions");
const Client = require('../../class/ExtendedClient');

module.exports = {
  event: 'ready',
  once: true,
  run: async (_, client) => {
    log('Logado em: ' + client.user.tag, 'done');
    let guilds = ['1077563002733219962', '995335063975768115', '985625402288529449', '1146220629230633071'];
        
    guilds.forEach(async (id) => {
      let guild = await client.guilds.fetch(id);
      if (!guild) return;
      // client.guilds.cache.set(id, guild);
      client.guilds.cache.get(id)?.emojis.cache.map((e) => client.emoji[e.name] = `${e}`);
    });
  }
};
