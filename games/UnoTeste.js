const { Collection, ComponentType, EmbedBuilder, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const emojis = require('./UnoResources/UnoEmojis');

module.exports = class UnoGame {
  constructor(client, message, channel) {
    this.client = client;
    this.message = message;
    this.owner = message.author.id;
    this.channel = channel;
    this.running = false;
    this.bolo = [
      ...Array(10).fill(true).map((e, i) => ({ value: i, color: 'blue', emoji: emojis[i].blue })),
      ...Array(10).fill(true).map((e, i) => ({ value: i, color: 'green', emoji: emojis[i].green })),
      ...Array(10).fill(true).map((e, i) => ({ value: i, color: 'red', emoji: emojis[i].red })),
      ...Array(10).fill(true).map((e, i) => ({ value: i, color: 'yellow', emoji: emojis[i].yellow })),

      ...Array(9).fill(true).map((e, i) => ({ value: i + 1, color: 'blue', emoji: emojis[i + 1].blue })),
      ...Array(9).fill(true).map((e, i) => ({ value: i + 1, color: 'green', emoji: emojis[i + 1].green })),
      ...Array(9).fill(true).map((e, i) => ({ value: i + 1, color: 'red', emoji: emojis[i + 1].red })),
      ...Array(9).fill(true).map((e, i) => ({ value: i + 1, color: 'yellow', emoji: emojis[i + 1].yellow })),

      ...Array(2).fill(true).map(() => ({ value: 'block', color: 'blue', emoji: emojis.block[0] })),
      ...Array(2).fill(true).map(() => ({ value: 'block', color: 'red', emoji: emojis.block[2] })),
      ...Array(2).fill(true).map(() => ({ value: 'block', color: 'green', emoji: emojis.block[1] })),
      ...Array(2).fill(true).map(() => ({ value: 'block', color: 'yellow', emoji: emojis.block[3] })),

      ...Array(2).fill(true).map(() => ({ value: 'reverse', color: 'blue', emoji: emojis.reverse[0] })),
      ...Array(2).fill(true).map(() => ({ value: 'reverse', color: 'red', emoji: emojis.reverse[2] })),
      ...Array(2).fill(true).map(() => ({ value: 'reverse', color: 'green', emoji: emojis.reverse[1] })),
      ...Array(2).fill(true).map(() => ({ value: 'reverse', color: 'yellow', emoji: emojis.reverse[3] })),

      ...Array(2).fill(true).map(() => ({ value: 'plus_two', color: 'blue', emoji: emojis.plus_two[0] })),
      ...Array(2).fill(true).map(() => ({ value: 'plus_two', color: 'red', emoji: emojis.plus_two[2] })),
      ...Array(2).fill(true).map(() => ({ value: 'plus_two', color: 'green', emoji: emojis.plus_two[1] })),
      ...Array(2).fill(true).map(() => ({ value: 'plus_two', color: 'yellow', emoji: emojis.plus_two[3] })),

      ...Array(4).fill(true).map(() => ({ value: 'plus_four', emoji: emojis.plus_four })),
      ...Array(4).fill(true).map(() => ({ value: 'changeColor', emoji: emojis.changeColor }))
    ].sort(() => 0.5 - Math.random());
    this.mesa = [];
    this.users = new Collection();
    this.position = 0;
    this.rotate = false;
  }

  start() {
    for (const user of this.users.map(x => x)) {
      for (let i = 0; i < 7; i++) {
        const card = this.bolo[0];

        user.cards.push(card);

        this.bolo.splice(0, 1);
      };

    user.cards = user.cards.reduce((a, b) => a.find(u => u[0].emoji === b.emoji) ? [...a.map(u => u[0].emoji === b.emoji ? [...u, b] : [...u])] : [...a, [b]], [])
    };

    this.play(this.users.first());

    return true;
  }

  async play (user) {
    this.now = user;
    
    const buttonSee = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('👀')
      .setCustomId('see');

    const menu = new StringSelectMenuBuilder()
      .setPlaceholder('Escolher carta')
      .setCustomId(`menuUno - ${this.message.channel.id}`);

    const buyButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setLabel('Comprar carta')
      .setCustomId(`buyUno - ${this.message.channel.id}`);

    user.cards.forEach((c, i) => menu.addOptions(new StringSelectMenuOptionBuilder().setEmoji(c[0].emoji.replace(/[^0-9]/gi, '')).setLabel(`${c.length} cartas desse tipo`).setValue(JSON.stringify(c[0]))));

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Uno - Vez de ${user.user.tag}`, iconURL: 'https://w7.pngwing.com/pngs/325/420/png-transparent-uno-playing-card-card-game-playing-card-game-text-trademark.png' })
      .setDescription(`▫️ Clique em 👀 para visualizar suas cartas;
▫️ Insira o número correspondente à posição da carta para jogá-la.

Última carta lançada: ${this.mesa[this.mesa.length - 1]?.emoji || '`Nenhuma`'}`)
    if (this.mesa[this.mesa.length - 1]) embed.setImage(getEmojiUrl(this.mesa[this.mesa.length - 1]?.emoji)).setThumbnail('https://thumbs.gfycat.com/AnguishedDenseAdouri-size_restricted.gif');

    const buttonsMsg = new ActionRowBuilder().addComponents(buttonSee)
    const msg = await this.channel.send({ content: `${user.user}`, embeds: [embed], components: [buttonsMsg] });
    const filter = (b) => b.user.id === user.id;
    const buttonCollector = msg.createMessageComponentCollector({ filter: filter, componentType: ComponentType.Button, max: 1 });

    this.timeout = setTimeout(async () => {
      buttonCollector.stop();
      
      this.position += (this.rotate ? -1 : 1);
      
      if (this.position === this.users.size) this.position = 0;
      if (this.position === -1) this.position = this.users.size - 1;

      const c = this.bolo[0];

      if (user.cards.find(c => c[0].emoji === c.emoji)) user.cards[user.cards.findIndex(c => c[0].emoji === c.emoji)].push(c);
      else user.cards.push([c]);

      this.bolo.splice(0, 1);
      this.channel.send({ content: `(  ) › ${user.user} foi pulado por demorar demais para jogar e comeu uma carta automaticamente!` });
      this.play(this.users.get(this.users.map(x => x)[this.position].id));
    }, 30000);

    buttonCollector.on('collect', async (button) => {
      const cards = user.cards;
      button.reply({ content: button.customId })
    });
  }
}


const getEmojiUrl = (emoji) => {
  for (let match of emoji.matchAll(/<(a)?:([\w\d]{2,32})+:(\d{17,19})>/g)) {
    const [, animated, name, id] = match;

    return this.client.rest.cdn + '/emojis/' + id + '.' + (Boolean(animated) ? 'gif' : 'png');
  }
}