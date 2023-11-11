const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ComponentType } = require('discord.js');

module.exports = {
  structure: {
    name: 'embed-builder',
    description: 'Crie uma Embed através do bot.',
    aliases: ['embed', 'eb'],
    developer: true
  },
  run: async (client, message, args) => {
    let embed = new EmbedBuilder();
    let options = [{
      name: 'Author',
      emoji: '✏️',
      args: [{
        label: 'Texto',
        required: true,
        id: 'text',
        type: 'Short',
        min: 1, max: 200
      }, {
        label: 'Ícone (URL)',
        hint: 'Coloque "#attachments" para caso você seja enviar uma Arquivo de Imagem.',
        id: 'image',
        required: false,
        type: 'Short',
        min: 12, max: 2000
      }]
    }, {
      name: 'Título',
      value: 'title',
      emoji: '📜',
      args: [{
        label: 'Texto',
        id: 'text',
        required: true,
        type: 'Short',
        min: 1, max: 200
      }, {
        label: 'URL',
        id: 'link',
        required: false,
        type: 'Short',
        min: 12, max: 2000
      }]
    }, {
      name: 'Cor',
      value: 'color',
      emoji: '📚',
      args: [{
        label: 'Cor (Hexadecimal [000000])',
        id: 'cor',
        required: true,
        type: 'Short',
        min: 3, max: 8
      }]
    }, {
      name: 'Thumbnail (Miniatura)',
      value: 'thumb',
      emoji: '🖼️',
      args: [{
        label: 'Imagem (URL)',
        hint: 'Coloque "#attachments" para caso você seja enviar uma Arquivo de Imagem.',
        id: 'image',
        required: true,
        type: 'Short',
        min: 12, max: 2000
      }]
    }, {
      name: 'Descrição',
      value: 'description',
      emoji: '📑',
      args: [{
        label: 'Texto',
        id: 'text',
        required: true,
        type: 'Paragraph',
        min: 1, max: 3000
      }]
    }, {
      name: 'Imagem',
      value: 'image',
      emoji: '📸',
      args: [{
        label: 'Imagem (URL)',
        hint: 'Coloque "#attachments" para caso você seja enviar uma Arquivo de Imagem.',
        id: 'image',
        required: true,
        type: 'Short',
        min: 12, max: 2000
      }]
    }, {
      name: 'Footer (Rodapé)',
      value: 'footer',
      emoji: '🏷️',
      args: [{
        label: 'Texto',
        id: 'text',
        required: true,
        type: 'Short',
        min: 1, max: 200
      }, {
        label: 'Ícone (URL)',
        hint: 'Coloque "#attachments" para caso você seja enviar uma Arquivo de Imagem.',
        id: 'image',
        required: true,
        type: 'Short',
        min: 12, max: 2000
      }]
    }, {
      name: 'Adicionar Field (Campo)',
      value: 'addfield',
      emoji: '🗂️',
      args: [{
        label: 'Título',
        id: 'title',
        required: true,
        type: 'Short',
        min: 1, max: 200
      }, {
        label: 'Texto',
        id: 'text',
        required: true,
        type: 'Paragraph',
        min: 1, max: 2000
      }, {
        label: 'Inline (Na linha)',
        id: 'inline',
        required: false,
        type: 'Short',
        min: 3, max: 5
      }]
    }];
    let select = new StringSelectMenuBuilder()
      .setCustomId('embed-builder')
      .setPlaceholder('Escolha uma das opções');
      
    options.forEach(({ name, description, emoji, value }) => {
      if (!name) return;
      let option = new StringSelectMenuOptionBuilder()
        .setLabel(name)
        .setValue(value || name.toLowerCase());
      
      if (description) option.setDescription(description);
      if (emoji) option.setEmoji(emoji);
      select.addOptions(option);
    });
    const row = new ActionRowBuilder()
      .addComponents(select);
    
    const msg = await message.channel.send({ content: `( 👎 ) › Não há nada por aqui...`, components: [row] });
    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 * 10 });
      
    collector.on('collect', (r) => {
      if (r.user.id === message.author.id) {
        let op = r.values[0];
        const modal = new ModalBuilder()
          .setCustomId('modal-EmbedBuilder')
          .setTitle('Construtor de Embed');
        
        
        options.filter(({ name, value }) => (value || name.toLowerCase()) === op)[0]?.args?.map(({ label, id, hint, required, type, min, max }, ind) => {
          let input = new TextInputBuilder()
            .setCustomId(id || label.toLowerCase())
            .setLabel(label)
            .setRequired(required)
            .setStyle(TextInputStyle[type || 'Short'])
            .setMinLength(min || 1)
            .setMaxLength(max || 2000);
            
            if (hint) input.setPlaceholder(hint);
            input = new ActionRowBuilder().addComponents(input);
            modal.addComponents(input);
          });
        
        let mdl = op;
        r.showModal(modal);
        r.awaitModalSubmit({ time: 3600000 * 2 }).then((int) => {
          const isImage = (url) => url.match (/\\. (jpeg|jpg|gif|png)$/) != null ? url : client.user.displayAvatarURL();
          const v = (inputID) => int.fields.fields.get(inputID)?.value;
          if (v('image') === '#attachment') return int.reply({ content: 'A função ainda não foi implementada.', ephemeral: true });
          if (mdl === 'author') {
            embed.setAuthor({ name: v('text') });
            if (v('image') && v('image') !== '#attachment') embed.data.author.icon_url = isImage(v('image'));
              
          } else if (mdl === 'title') {
            embed.setTitle(v('text'));
            if (v('link')) embed.setURL(v('link'));
          } else if (mdl === 'color') {
            let cor = parseInt('0x' + v('cor').toLowerCase().replaceAll('#', ''));
            try {
              if (cor == NaN) cor = 0xf7b267;
              embed.setColor(cor);
            } catch (err) {
              embed.setDescription('Cor...').setColor(cor);
            }
          } else if (mdl === 'thumb') {
            if (v('image') && v('image') !== '#attachment') embed.setThumbnail(isImage(v('image')));
          } else if (mdl === 'description') {
            embed.setDescription(v('text'));
          } else if (mdl === 'image') {
            if (v('image') && v('image') !== '#attachment') embed.setImage(isImage(v('image')));
          } else if (mdl === 'footer') {
            embed.setFooter({ text: v('text') });
            if (v('image') && v('image') !== '#attachment') embed.data.footer.icon_url = isImage(v('image'));
          } else if (mdl === 'addfield') {
            if ((embed.data.fields?.length || 0) === 25) return;
            embed.addFields({ name: v('title'), value: v('text'), inline: /sim|yes|true/.test(v('inline')) });
          } else {
            // '...'
          }
          
          int.update({ content: '', embeds: [embed] }).catch((err) => console.log);
          // int.reply({ content: 'Sucesso!', ephemeral: true });
        }).catch((err) => console.log(err));
      } else {
        r.reply({ content: `( ${client.emoji['STL_X']} ) › Estes botões não são para você.`, ephemeral: true });
      }
    });
      
    collector.on('end', () => {
      // message.edit({ embeds: [embed], components: [] });
    });
  }
}