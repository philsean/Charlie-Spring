module.exports = {
  event: 'messageCreate',
  run: async (client, message) => {
    let cooldown = await client.database.crypto.findOne() || 0;
    if ((cooldown + 60000 * 5) < Date.now()) {
      await client.database.updatePurse();
      await client.database.crypto.updateOne({}, { $set: { lastUpdate: Date.now() } });
    };
  }
};
