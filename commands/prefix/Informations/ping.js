module.exports = {
  structure: {
    name: 'ping',
    description: 'Latência da WebSocket do bot.',
    aliases: ['latencia', 'latency']
  },
  run: async (client, message, args) => {
    message.reply({
      content: `**( 🏓 ) › Pong.**\n>>> **Websocket:** \`${client.ws.ping}ms\`\n**Tempo de execução:** \`${Date.now() - message.createdTimestamp}ms\``
    });
  }
}
