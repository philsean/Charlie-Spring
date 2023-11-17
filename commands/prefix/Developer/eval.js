const { Message, Collection, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { inspect, promisify } = require('util');
const Client = require('../../../class/ExtendedClient');
const isPromise = v => typeof v === 'object' && typeof v.then === 'function';

const cpExec = promisify(require('child_process').exec);
const exec = async (execution) => {
  const { stdout, stderr } = await cpExec(execution);
  return { out: stdout, err: stderr };
};

module.exports = {
	structure: {
		name: 'eval',
		description: 'Eval!',
		aliases: ['ev'],
		developer: true
	},
	run: async (client, message, args, db) => {
    if (message.author.id !== '916712541797896263') return;
    
    try {
      let code = args.join(' ');
      if (args[0] === '--exec') {
        args.shift();
        code = 'exec("' + args.join(' ') + '")';
      } else if (args[0] === '--async') {
        args.shift();
        code = `(async () => { ${args.join(' ').replaceAll('--r', 'return')} })();`
      }
      
      let evaled = eval(code);
      let awaited = false;
      if (isPromise(evaled)) {
        evaled = await evaled;
        awaited = true;
      }
      
      message.reply({ content: (awaited ? '**Awaited...**\n' : '') + '```js\n' + inspect(evaled, { depth: 0 }).slice(0, 1960) + '```' });
    } catch (err) {
      console.log(err);
      message.reply({ content: '```js\n' + err + '```' });
    }
  }
};
