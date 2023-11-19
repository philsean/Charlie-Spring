const { ChannelType, Message } = require('discord.js');
const config = require('../../config');
const { log } = require('../../functions');
const GuildSchema = require('../../Models/GuildSchema');
const User = require('../../Models/User')
const ExtendedClient = require('../../class/ExtendedClient');

const cooldown = new Map();

module.exports = {
    event: 'messageCreate',
    run: async (client, message) => {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;
        if (!config.handler.commands.prefix) return;

        let prefix = config.handler.prefix;

        if (config.handler?.mongodb?.toggle) {
            client.database.guild = GuildSchema;
            try {
                const guildData = await GuildSchema.findOne({ guild: message.guildId });

                if (guildData && guildData?.prefix) prefix = guildData.prefix;
            } catch {
                prefix = config.handler.prefix;
            };
        };

      if (message.mentions.users.get(client.user.id) && message.content.replace('!', '').replace(`${message.mentions.users.get(client.user.id)}`, '') === '') {
        await message.reply({
          content: `**( 💐 ) › ${message.author.globalName || message.author.username}**. Olá internauta, eu sou a **${client.user.username}** um bot como qualquer outro. Meu prefixo é \`${prefix}\`, possuo alguns comandos que você pode ver no \`${prefix}help\`.`
        });
        return;
      }
        let botName = client.user.username.toLowerCase().split(' ')[0];
        if (![botName, `${botName},`, prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`].some(x => message.content.toLowerCase().startsWith(x))) return;
        const prefixGet = [botName, `${botName},`, prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`].filter(x => message.content.toLowerCase().startsWith(x))[0];
        message.guild.prefix = prefix;
        message.prefix = prefixGet;
        const args = message.content.slice(prefixGet.length).trim().split(/ +/g);
        const commandInput = args.shift().toLowerCase();

        if (!commandInput.length) return;

        let command = client.commands.prefix.get(commandInput) || client.commands.prefix.get(client.commands.aliases.get(commandInput));

        if (command) {
            try {
                // if (message.author.id !== '916712541797896263') return message.reply(`( ${client.emoji.x} ) › Está tendo uma manutenção no momento.`);
                if ((command.structure?.developer || false) && config.users.developers.indexOf(message.author.id) === -1) {
                  await message.reply({ content: `( ${client.emoji.x} ) › Este comando é designado aos meus desenvolvedores.` });
                  return;
                }
                if (command.structure?.permissions && !message.member.permissions.has(command.structure?.permissions)) {
                    await message.reply({
                        content: '**( <:STL_X:1129745080413069412> ) › Você não tem permissão para utilizar este comando.**'
                    });

                    return;
                };

                if (command.structure?.cooldown) {
                    const cooldownFunction = () => {
                        let data = cooldown.get(message.author.id);

                        data.push(commandInput);

                        cooldown.set(message.author.id, data);

                        setTimeout(() => {
                            let data = cooldown.get(message.author.id);

                            data = data.filter((v) => v !== commandInput);

                            if (data.length <= 0) {
                                cooldown.delete(message.author.id);
                            } else {
                                cooldown.set(message.author.id, data);
                            };
                        }, command.structure?.cooldown);
                    };

                    if (cooldown.has(message.author.id)) {
                        let data = cooldown.get(message.author.id);

                        if (data.some((v) => v === commandInput)) {
                            await message.reply({
                                content: '( <:STL_X:1129745080413069412> ) › Desacelere amigo! Você é muito rápido para usar este comando.'
                            });

                            return;
                        } else {
                            cooldownFunction();
                        };
                    } else {
                        cooldown.set(message.author.id, [commandInput]);

                        cooldownFunction();
                    };
                };

                User.user = await User.findOne({ _id: message.author.id });
                if (!User.user) {
                  let msg = await message.reply({ content: `( ${client.emoji['STL_paper']} ) › Verifiquei que você não está na minha database, aguarde alguns instantes até que eu registre.` });
                  try {
                    let us = new User({
                      _id: message.author.id
                    });
                    await us.save();
                    
                    msg.edit({ content: `( ${client.emoji['STL_V']} ) › **Pronto!** Você foi registrado na minha database, o comando que digitou será executado.` });
                    User.user = await User.findOne({ _id: message.author.id });
                  } catch (err) {
                    return msg.reply({ content: `( ${client.emoji['STL_X']} ) › Algo deu errado ao registrar, tente novamente. Caso essa mensagem continue aparecendo, fale com meu suporte.` });
                  }
                }
                message.error = (options) => {
                    let m = `**( ${options.emoji || '<:taser:1169712988773695548>'} ) â€º ${this.author},** `
                    if (typeof options == 'string') options = m + options;
                    else options.content = m + options.content;
                    return message.reply(options);
                };
                command.run(client, message, args, User);
            } catch (error) {
                log(error, 'err');
                if (message.author.id == '916712541797896263') message.reply(`**( ${client.emojis.x} ) › Error:**\n\`\`\`\n${(error)?.slice(0, 1800)}\`\`\``);
            }
        }
    },
};
