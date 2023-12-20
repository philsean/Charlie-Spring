const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const puzzles = {
  1: {
    name: 'Hora de Aventura (Adventure Time)',
    abb: 'hda',
    emojis: [ '<:hda1:1185230990608711730>', '<:hda2:1185231279722074223>', '<:hda3:1185231355538325555>', '<:hda4:1185231400295727254>',
    '<:hda5:1185231459045351534>', '<:hda6:1185231495732932688>', '<:hda7:1185231535872409621>', '<:hda8:1185231585503625296>']
  },
  2: {
    name: 'A Noite Estrelada - Vincent Van Gogh (The Starry Night)',
    abb: 'ne',
    emojis: [ '<:ne1:1186621328372023426>', '<:ne2:1186621366011703316>', '<:ne3:1186621402606997534>', '<:ne4:1186621442339651584>',
    '<:ne5:1186621486975426560>', '<:ne6:1186621522916425798>', '<:ne7:1186621572199497758>', '<:ne8:1186621615346286673>']
  },
  3: {
    name: 'Five Nights at Freddy’s',
    abb: 'fnaf',
    emojis: [ '<:fnaf1:1186620484155080744>', '<:fnaf2:1186620516157640755>', '<:fnaf3:1186620550039212134>', '<:fnaf4:1186620591126614016>',
    '<:fnaf5:1186620635028402278>', '<:fnaf6:1186620673913798666>', '<:fnaf7:1186620705534656622>', '<:fnaf8:1186620769913024554>']
  },
  4: {
    name: 'Hollow Knight',
    abb: 'hk',
    emojis: [ '<:hk1:1186622383306579988>', '<:hk2:1186622422846292019>', '<:hk3:1186622453582143500>', '<:hk4:1186622480241139722>',
    '<:hk5:1186622517696278568>', '<:hk6:1186622552311873638>', '<:hk7:1186622583513284628>', '<:hk8:1186622612126842900>']
  }
};

module.exports = class Puzzle {
  constructor ({ client, message }) {
    this.client = client;
    this.message = message;
    this.image = ([1, 2, 3, 4].sort(() => 0.5 - Math.random()))[0];
    this.puzzle = puzzles[this.image];
    this.display = message;
    this.in = {
      tip: false,
      solved: Array(8).fill(this.puzzle.abb).map((x, i) => `${x}_${i}`),
      table: Array(8).fill(this.puzzle.abb).map((x, i) => `${x}_${i}`).sort(() => 0.5 - Math.random()),
      win: false,
      moves: []
    };
    this.moving = {};
    this.started = false;
  }
  
  start ({ tip }) {
    this.in.tip = tip || false;
    this.started = true;
    let rows;
    let embed;
    let updateButtons = () => {
      embed = new EmbedBuilder()
        .setColor(0x5865F2)
			   .setTitle(this.puzzle.name + ' - Puzzle')
			   .setDescription(`Resolva este quebra-cabeça e ganhe algo no final.` + (tip ? `\n**_Resolvido_:** \`( Você ganha menos pelas dicas. )\`\n||${this.puzzle.emojis.slice(0, 4).join('') + '\n' + this.puzzle.emojis.slice(4, 8).join('')}||` : ''))
        .setFooter({ text: `Movimentos: ${this.in.moves.length}` });

    
      rows = [new ActionRowBuilder(), new ActionRowBuilder()];
    
      this.in.table.map((x, i) => {
        let emoji = this.puzzle.emojis[x.split('_')[1]].replace('>', '').split(':')[2];
        let b = new ButtonBuilder()
          .setCustomId(`puzzle_${i}`)
          .setStyle(this.in.tip ? (this.in.table[i] === this.in.solved[i] ? ButtonStyle.Success : ButtonStyle.Secondary) : (i == this.moving.on ? ButtonStyle.Primary : ButtonStyle.Secondary))
          .setEmoji(emoji);

        rows[Math.floor(i / 4)] = rows[Math.floor(i / 4)].addComponents(b);
      });
    };
    updateButtons();

    this.message.channel.send({ embeds: [embed], components: rows }).then((display) => {
      this.display = display;
      let filter = (i) => i.user.id === this.message.author.id;
      let mv = display.createMessageComponentCollector({ filter, componentType: ComponentType.Button, idle: 60000, errors: ['idle', 'win'] });

      mv.on('collect', async (i) => {
        await i.deferUpdate()
        let position = Number(i.customId.split('_')[1]);
        
        if (!this.moving.on) {
          this.moving.on = position;
          updateButtons();
        } else {
          this.moving.to = position;
          this.in.moves.push(position);
          let wined = this.barter(this.moving);
          this.moving = {};
          updateButtons();
          if (wined) mv.stop('win');
        };
        i.editReply({ embeds: this.display.embeds, components: this.display.components });
      });
      mv.on('end', () => {
        this.display.components.map((_, i) => {
          this.display.components[i].components.map((__, y) => {
            this.display.components[i].components[y].data.disabled = true;
          });
        });
        this.display.edit({ embeds: this.display.embeds, components: this.display.components });
        this.client.games.puzzle.delete(this.message.author.id);
      });
    });
  }

  barter ({ on, to }) {
    let table = this.in.table;
    this.in.table[on] = table[to];
    this.in.table[to] = table[on];
    if (this.in.table !== this.in.solved) return false;
    this.in.win = true;
    return true;
  }
}