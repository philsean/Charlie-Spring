const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
  structure: {
    name: 'perfil',
    description: 'Veja o perfil de alguém no Charlie RPG.',
    aliases: ['profile', 'info', 'pr']
  },
  run: async (client, message, args) => {
    let s = await client.rpg.db.findOne({ nickname: args.join(' ') });
    s = s?._id;
    let user = s || client.findUser(args.join(' '), message)?.id || message.author.id;
    user = client.findUser(user);
    let rpg = await client.rpg.getUser(user.id);
    if (!rpg) return message.error('o usuário não iniciou sua aventura ainda. Convide ele para se divertir também.');
    
    let e = [['<:arqueira:1169761068613111869>', '<:arqueiro:1169761125215256757>'], ['<:guerreira:1169761025248198716>', '<:guerreiro:1169760987784675380>'], ['<:maga:1169760746595422258>', '<:mago:1169760591850774631>'], ['<:paladina:1169760490226995291>', '<:paladino:1169760445427617822>']];
    let tr = [['Arqueira', 'Arqueiro'], ['Guerreira', 'Guerreiro'], ['Maga', 'Mago'], ['Paladina', 'Paladino']];
    let emoji = e[rpg.class][rpg.gender];
    
    let xp = rpg.bars.xp;
    let level = rpg.bars.level;
    let xpP = rpg.max.xp;
    
    let embed = {
      color: 5793266,
      thumbnail: { url: 'https://cdn.discordapp.com/emojis/' + emoji.replace('>', '').split(':')[2] + '.png' },
      title: `${tr[rpg.class][rpg.gender]} ${rpg.nickname} (${user.displayName}) | Level: ${level} (${xp}/${xpP})`,
      timestamp: new Date().toISOString(),
      footer: { text: `› Executado por: ${message.author.displayName}`, icon_url: message.author.displayAvatarURL() }
    };
      
    let profile = () => {
      embed.description = `**${rpg.bars.life}/${rpg.max.life} › Vida:** ${barrier({ value: rpg.bars.life, max: rpg.max.life, bars: 6 })}\n**${rpg.bars.xp}/${rpg.max.xp} › Exp.:** ${barrier({ value: xp, max: rpg.max.xp, bars: 6, bar: { off: { start: '<:xp4:1170183577384800287>', half: '<:xp5:1170183629729714268>', end: '<:xp6:1170183674248036352>' }, on: { start: '<:xp1:1170181126833328320>', half: '<:xp2:1170181167929106434>', end: '<:xp3:1170181211780567061>' } } })}\n**${rpg.bars.stamina * 100}% › Estâmina:** ${barrier({ value: rpg.bars.stamina, max: rpg.max.stamina, bars: 6, bar: { off: { start: '<:stamina4:1170207668548419675>', half: '<:stamina5:1170207717575630898>', end: '<:stamina6:1170207753814417458>' }, on: { start: '<:stamina1:1170207536394293310>', half: '<:stamina2:1170207578094063637>', end: '<:stamina3:1170207623224766514>' } } })} ${rpg.class == 2 ? `\n**${rpg.bars.mana * 100}% › Mana:** ${barrier({ value: rpg.bars.mana, max: rpg.max.mana, bars: 6, bar: { off: { start: '<:mana4:1170197560888135710>', half: '<:mana5:1170197589350682635>', end: '<:mana6:1170197617435758613>' }, on: { start: '<:mana1:1170197467850092627>', half: '<:mana2:1170197495603794042>', end: '<:mana3:1170197532924711006>' } } })}` : ''}`;
      embed.fields = [{ name: 'Atributos', value: `>>> **Força:** \`${rpg.traits.strength}\`\n**Resistência:** \`${rpg.traits.resistance}\`\n**Agilidade:** \`${rpg.traits.agility}\`\n**Inteligência:** \`${rpg.traits.brain}\`\n**Detecção:** \`${rpg.traits.detection}\`\n**Personalidade:** \`${rpg.traits.person}\``, inline: true }, { name: 'Informações de Ataque', value: `>>> **Dano:** \`${rpg.stats.demage}\`\n**Velocidade:** \`${rpg.stats.speed}\`\n**Crítico:** \`${rpg.stats.critical}\`\n**DPS:** \`${rpg.stats.dps}\`\n**Efeito:** \`?\``, inline: true }];
    };
    profile();
    
    message.reply({ content: `${message.author}`, embeds: [embed] });
  }
};

function barrier (options) {
  let barriers = { off: {
    start: options.bar?.off?.start || '<:life4:1170197350938054696>',
    half: options.bar?.off?.half || '<:life5:1170197397847163004>',
    end: options.bar?.off?.end || '<:life6:1170197438078926848>'
  }, on: {
    start: options.bar?.on?.start || '<:life1:1170197212102410303>',
    half: options.bar?.on?.half || '<:life2:1170197254141902967>',
    end: options.bar?.on?.end || '<:life3:1170197299520094230>'
  } },
      value = options.value || 0,
      max = options.max || 100,
      per = value / max,
      bars = options.bars || 10,
      array = Array(bars).fill(barriers.off.half);
    for (let i = 0; i < (per * bars); i++) array[i] = barriers.on.half;
    array[0] = per >= 0.01 ? barriers.on.start : barriers.off.start;
    array[bars - 1] = per === 1 ? barriers.on.end : barriers.off.end;
    return array.join('');
      }
