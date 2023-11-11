module.exports = {
  event: 'messageUpdate',
  run: async (client, _, message) => {
    if (typeof message.editedTimestamp !== 'number') return;
    client.emit('messageCreate', message);
  }
}