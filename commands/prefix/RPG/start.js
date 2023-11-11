const { EmbedBuilder, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

let map = new Map();

module.exports = {
  structure: {
    name: 'iniciar',
    description: 'Inicie uma aventura no RPG.',
    aliases: ['start', 'começar', 'cmc']
   
  },
  run: async (client, message, args) => {
    let userData = await client.rpg.getUser(message.author.id);
    if (map.has(message.author.id)) return message.error(`já tem um registro no momento, verifique sua DM.`);
    if (userData) return message.error(`você já iniciou uma aventura no rpg.`);
    map.set(message.author.id, true);
    let end = (colect) => {
      let del = () => map.delete(message.author.id);
      if (colect) colect.on('end', del);
      else del();
      message.error('o tempo esgotou, tente novamente.');
    };
    let filter = (response) => response.content || false;
    let form = {};
    
    await message.reply(`**( <:power:1169756461614776382> ) › ${message.author},** aguarde 15s enquanto eu preparo tudo. \`[ Enquanto isso, abra a sua DM, o registro será por lá ]\``).then((wait) => {
      setTimeout(() => {
        wait.delete().catch(() => 0);
        try {
          message.author.send(`**( <:parchment:1169752003581313165> ) › Vamos começar com seu codenome (apelido). \`[ Envie uma resposta aqui no chat, 30s ]\`**`).then((dm) => {
           dm.channel.awaitMessages({ filter, max: 1, time: 30_000, errors: ['time'] }).then((ni) => {
              form.nickname = ni.first().content.slice(0, 20);
              // console.log(form);
              
              let woman = new ButtonBuilder()
                .setCustomId('woman')
                .setLabel('Feminino')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('1169748210311499897');
              let man = new ButtonBuilder()
                .setCustomId('man')
                .setLabel('Masculino')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('1169748245006786640');
              
              let row = new ActionRowBuilder().addComponents(woman, man);
              ni.first().reply({ content: `**( <:gender:1169751737557602385> ) › Belo nome, agora me diga qual vai ser o gênero do seu personagem. \`[ Clique nos botões abaixo, 30s ]\`**`, components: [row] }).then((gen) => {
                gen.awaitMessageComponent({ filter: (i) => i.deferUpdate(), componentType: ComponentType.Button, max: 1, time: 30_000, errors: ['time'] }).then((it) => {
                  let selected = it.customId;
                  form.gender = ['woman', 'man'].indexOf(selected);
                  // console.log(form);
                  
                  let archer = new ButtonBuilder().setCustomId('archer').setLabel(form.gender === 0 ? 'Arqueira' : 'Arqueiro').setStyle(ButtonStyle.Primary).setEmoji(form.gender === 0 ? '1169761068613111869' : '1169761125215256757');
                  let warrior = new ButtonBuilder().setCustomId('warrior').setLabel(form.gender === 0 ? 'Guerreira' : 'Guerreiro').setStyle(ButtonStyle.Primary).setEmoji(form.gender === 0 ? '1169761025248198716' : '1169760987784675380');
                  let wizard = new ButtonBuilder().setCustomId('wizard').setLabel(form.gender === 0 ? 'Maga' : 'Mago').setStyle(ButtonStyle.Primary).setEmoji(form.gender === 0 ? '1169760746595422258' : '1169760591850774631');
                  let paladin = new ButtonBuilder().setCustomId('paladin').setLabel(form.gender === 0 ? 'Paladina' : 'Paladino').setStyle(ButtonStyle.Primary).setEmoji(form.gender === 0 ? '1169760490226995291' : '1169760445427617822');
                  
                  let classes = new ActionRowBuilder().addComponents(archer, warrior, wizard, paladin);
                    
                  it.editReply({ content: `**( <:power:1169756461614776382> ) › Perfeito, por último, selecione qual a classe que seu personagem pertencerá, lembre-se que cada classe tem habilidades diferentes. \`[ Clique nos botões abaixo, 30s ]\`**`, components: [classes] }).then((cl) => {
                    cl.awaitMessageComponent({ filter: (i) => i.deferUpdate(), componentType: ComponentType.Button, max: 1, time: 30_000, errors: ['time'] }).then(async (classe) => {
                      let cla = ['archer', 'warrior', 'wizard', 'paladin'].indexOf(classe.customId);
                      form.class = cla;
                      
                      await client.rpg.createUser(message.author.id, form);
                      classe.editReply({ content: `**( <:pata:1169783467995832330> ) › Parabéns, você foi registrado no meu RPG, você pode ver mais comandos utilizando \`${message.prefix}help\`.**`, components: [] });
                    }).catch(() => end());
                  });
                }).catch(() => end());
              });
            }).catch(() => end());
          });
        } catch (err) {
          message.channel.send(`**( <:taser:1169712988773695548> ) › ${message.author},** ouve um erro ao tentar lhe registrar, tente novamente ou reporte a minha equipe. \`[ Não se esqueça que você precisa estar com a DM (Privado) aberto. ]\``);
          end();
        }
      }, 15_000);
    });
  }
};