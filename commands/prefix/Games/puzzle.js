const Puzzle = require('../../../games/Puzzle');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
  structure: {
    name: 'puzzle',
    description: 'Resolva o quebra cabeça.',
    aliases: ['quebra-cabeça'],
    developer: true
  },
  run: async (client, message, args) => {
    let game = client.games.puzzle.get(message.author.id);
    if (game) return message.reply(`( ${client.emoji.x} ) › Já tem uma partida sua rolando: https://discord.com/channels/${game.display.guild.id}/${game.display.channel.id}/${game.display.id}`);
    
    let withoutTip = new ButtonBuilder().setCustomId('without').setLabel('Começar.').setStyle(ButtonStyle.Secondary);
    let withTip = new ButtonBuilder().setCustomId('with').setLabel('Começar com dicas.').setStyle(ButtonStyle.Primary);

    client.games.puzzle.set(message.author.id, new Puzzle({ client, message }));
    game = client.games.puzzle.get(message.author.id);

    message.reply({ content: '**( 🧩 ) › Puzzle `( Quebra-cabeça )`**\n>>> O jogo consiste em você colocar as peças em seus lugares correspondentes, ao conseguir resolver um puzzle você ganha algo aleatório decidido pelo bot. Claro, quanto mais você joga, mais as chances de você ganhar algo bom aumenta.\n\n*Clique no botão abaixo para iniciar um puzzle, e boa sorte.*', components: [new ActionRowBuilder().addComponents(withoutTip, withTip)] }).then((q) => {
      let filter = (i) => i.user.id === message.author.id;
      let quest = q.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15000, max: 1 });

      quest.on('collect', (i) => {
        q.delete();
        game.start({ tip: i.customId === 'with' ? true : false });
      });
      quest.on('end', () => {
        if (!game.started) client.games.puzzle.delete(message.author.id);
      });
    });
  }
}
