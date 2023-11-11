let animals = '🐵 🦍 🐶 🐺 🦊 🐱 🦁 🐯 🐴 🦌 🐮 🐷 🐏 🐑 🦒 🐭 🐹 🐰 🦇 🐻 🐨 🐼 🐣 🐥 🐧 🦉 🐸 🐙 🐛 🐞 🦋 🌟'
let flowers = '💐 🌸 💮 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🌲 🌳 🌴 🌵 🌾 🌿 ☘️ 🍀 🍁 🍂 🍃 🍄 ❄️ ⚡ 🌟';
let foods = '🍇 🍈 🍉 🍊 🍋 🍌 🍍 🍎 🍏 🍐🍑 🍒 🍓 🥝 🍅 🥥 🥑 🍆 🥔 🥕 🌽 🌶️ 🥒 🥦 🥜 🌰 🍞 🌟 🥐 🥖 🥨 🥞 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🥙 🥚 🍳 🥘 🍲 🥣 🥗 🍿 🥫 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 🍥 🍡 🥟 🥠 🥡 🦀 🦐 🦑 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🥧 🍫 🍬 🍭 🍮 🍯';
let climate = '☁️ ⛅ ⛈️ 🌤️ 🌥️ 🌦️ 🌧️ 🌨️ 🌩️ 🌪️ 🌫️ 🌬️ ❄️ ☃️ ⛱️ ☔ ⚡ 🌟 ☀️ 🌡️ 🌖 🌈';
const categories = [animals, flowers, foods, climate];
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = class MatchingGame {
  constructor (client, message, size, categorie, users) {
    this.client = client;
    this.message = message;
    this.users = users;
    this.turn = true;
    let e = (categories[['animals', 'flowers', 'foods', 'climate'].indexOf(categorie)] || categories.sort(() => 0.5 - Math.random())[0]).split(' ').sort(() => 0.5 - Math.random()).slice(0, size * 2);
    e.map(x => e.push(x));
    this.emojis = e.sort(() => 0.5 - Math.random());
    this.resolved = [];
      for (let i = 0; i < this.emojis.length; i += size) {
        let column = this.emojis.slice(i, i + size);
        this.resolved.push(column);
      }
    this.table = this.resolved.map(x => Array(x.length).fill('⬛'));
    this.size = size || 5;
    this.recentMoves = [];
  }
    
  start () {
    let table = resolve(this, 'table');
    
    let embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`( ${this.emojis[0]} ) › Jogo da Memória`)
      .setDescription(`# Começa a vez com ${this.users[0]}\n>>> ${table}`)
    let button = new ButtonBuilder()
      .setCustomId('answer')
      .setLabel('Jogar')
      .setEmoji('🕹️')
      .setStyle(ButtonStyle.Secondary);
    let row = new ActionRowBuilder()
      .addComponents(button);
    
    this.message.edit({ content: '', embeds: [embed], components: [row] });
    this.message.createMessageComponentCollector({ filter: (i) => this.users[(this.turn ? 0 : 1)]?.id === i.user.id, componentType: ComponentType.Button }).on('collect', async (i) => {
      this.displayModal(i);
      this.message.awaitModalSubmit().then((int) => {
        let moviments = int.fields.getTextInputValue('moviment').replaceAll(' ', '').split('-');
        let movt1 = moviments[0].toLowerCase().split('');
        let movt2 = moviments[1].toLowerCase().split('');
        if (!isNaN(movt1[0]) && isNaN(movt1[1]) || !isNaN(movt2[0]) && isNaN(movt2[1])) return int.reply({ content: 'Acho que está incorreta a forma que você digitou os movimentos.', ephemeral: true });
        let row1 = 'abcdefghijklmnopqrstuvwxyz'.indexOf(movt1[0]) + 1;
        let row2 = 'abcdefghijklmnopqrstuvwxyz'.indexOf(movt2[0]) + 1;
        
        if (row1 === -1 || row2 === -1) return int.reply({ content: 'Acho que está incorreta a forma que você digitou os movimentos.', ephemeral: true });
        movt1[1] = Number(movt1[1]);
        movt2[1] = Number(movt2[1]);
        if (movt1[1] < 1 || movt1[1] > this.size && movt2[1] < 1 || movt2[1] > this.size) return int.reply({ content: 'Acho que está incorreta a forma que você digitou os movimentos.', ephemeral: true });
        embed.setDescription(`${this.play(int.user.id, movt1, movt2)}`);
      });
    });
  }
    
  async displayModal (interaction) {
    const modal = new ModalBuilder()
      .setTitle('Jogo da memória')
      .setCustomId('jdmmodal');
    const movimentInput = new TextInputBuilder()
      .setCustomId('moviment')
      .setLabel('Qual será o seu movimento?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Exemplo: A1-B2')
      .setMinLength(5)
      .setMaxLength(5)
      .setRequired(true);
    
    const actRow = new ActionRowBuilder().addComponents(movimentInput);
    modal.addComponents(actRow);
    return await interaction.showModal(modal);
  }
  
  play (user, mov1, mov2) {
    const resolveColumn = (letter) => 'abcdefghijklmnopqrstuvwxyz'.split('').indexOf(letter.toLowerCase());
    let e1 = this.resolved[resolveColumn(mov1[0])][mov1[1]];
    
    if (mov2) {
       let e2 = this.resolved[resolveColumn(mov2[0])][mov2[1]];
       if (e1 === e2) {
         this.table[resolveColumn(mov1[0])][mov1[1]] = e1;
         this.table[resolveColumn(mov2[0])][mov2[1]] = e2;
         return resolve(this, 'table');
       } else {
         return resolve(this, 'table');
       }
    } else {
      this.table[resolveColumn(mov1[0])][mov1[1]] = e1;
      this.recentMoves?.push(mov1);
      
      return resolve(this, 'table');
    }
  }
}



function resolve (game, table) {
  table = table || 'resolved';
  let numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  let columns = 'abcdefghijklmnopqrstuvwxyz'.split('').slice(0, game.size);
  let tbl = [Array(game.size).fill(null).map((x, i, a) => `:${numbers[i + 1]}:`)];
  tbl[0].unshift(":black_large_square:")
  columns.map((y, i) => {
    let rw = game[table];
    tbl.push([`:regional_indicator_${y}:`]);
    rw[i].map(x => tbl[i + 1].push(x))
  });
  return tbl.map(x => x.join('  |  ')).join('\n');
       }
