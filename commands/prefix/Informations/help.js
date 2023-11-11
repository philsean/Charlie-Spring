const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
let categories = {
  'Games': 'Jogos',
  'Others': 'Outros',
  'Economy': 'Economia',
  'Informations': 'Informações',
  'Developers': 'Desenvolvedores',
  'Utils': 'Utilidades',
  'RPG': 'Charlie RPG'
}

module.exports = {
  structure: {
    name: 'help',
    description: 'Veja informações de meus comandos.',
    aliases: ['ajuda', 'sos'],

    args: [{
      name: 'comando',
      required: false
    }]
  },
  run: async (client, message, args) => {
    let commands = client.commands.prefix;
    let cmd;
    if (args[0]) cmd = commands.find(({ structure: { name, aliases } }) => name === args[0] || aliases.includes(args[0]) || name.includes(args[0]));
    if (cmd) {
      cmd = cmd.structure;
      let embed = {
        color: 0x5865f2,
        title: `( ${client.emoji['STL_leaf']} ) › ${cmd.name} - ${categories[cmd.categorie] ? categories[cmd.categorie] : cmd.categorie}`,
        fields: [{
          name: `${client.emoji['STL_paper']} › Descrição:`,
          value: cmd.description
        }, {
          name: `${client.emoji['STL_link']} › Alternativas (Aliases):`,
          value: `\`${cmd.aliases.join(', ')}\``
        }]
      };
      if (cmd.args) embed.fields.push({ name: `${client.emoji['STL_info']} › Argumentos:`, value: `>>> ${cmd.args.map(y => `**${y.name}** - ${y.required ? 'Argumento obrigatória.' : 'Argumento opcional.'}`).join('\n')}` })
      message.reply({ embeds: [embed] });
    } else {
      // if (message.author.id !== '916712541797896263') return message.error(`comando em manutenção...`);
      let solve = (array) => array.map(({ structure: { name, aliases } }) => `${name} ` + (aliases ? `\`[ ${aliases.join(', ')} ]\`` : '')).join(' | ');
      let pages = [{
        title: '( 💸 ) › Economia',
        commands: getCommands(commands, 'Economy')
      }, {
        title: '( 🍃 ) › Informações',
        commands: getCommands(commands, 'Informations')
      }, {
        title: '( 🕹️ ) › Jogos',
        commands: getCommands(commands, 'Games')
      }, {
        title: '(  ) › Charlie RPG',
        commands: getCommands(commands, 'RPG')
      }, {
        title: '( 🔩 ) › Utilidades',
        commands: getCommands(commands, 'Utils')
      }];
        
      let page = 0;
      let max = pages.length;
      
      let embed = {
        color: 0x5865f2,
        author: { name: `› Painel de Ajuda | ${client.user.username}`, icon_url: client.user.displayAvatarURL() },
        footer: { text: `comando [ aliases ] | ${message.prefix}help <comando>` },
        title: pages[page].title,
        description: solve(pages[page].commands)
      };
        
      let left = new ButtonBuilder().setCustomId('left').setStyle(ButtonStyle.Primary).setEmoji('⬅️');
      let right = new ButtonBuilder().setCustomId('right').setStyle(ButtonStyle.Primary).setEmoji('➡️');
      let row = new ActionRowBuilder().addComponents(left, right);
      message.reply({ embeds: [embed], components: [row] }).then((help) => {
        let filter = (it) => it.user.id === message.author.id;
        
        help.createMessageComponentCollector({ filter, componentType: ComponentType.Button, max: max * 5, time: 60000 * 5, errors: ['time'] }).on('collect', (i) => {
          if (i.customId === 'left') page--
          else page++;
          if (page === -1) page = pages.length - 1;
          else if (page === max) page = 0;
          
          embed.title = pages[page].title;
          embed.description = solve(pages[page].commands);
          
          i.update({ embeds: [embed], components: [row] });
        }).on('end', (err, r) => {
          // console.log(err, r);
          help.edit({ embeds:[embed], components: [] });
        });
      });
    }
  }
}

function getCommands (commands, c) {
  return commands.filter(({ structure: { categorie } }) => c.toLowerCase() === categorie.toLowerCase()).filter(({ structure: { developer } }) => (developer || false) !== true).map(x => x);
}