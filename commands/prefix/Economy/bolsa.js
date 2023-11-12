const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const ms = require('ms');

module.exports = {
  structure: {
    name: 'bolsa',
    description: 'Veja a bolsa de valores das criptomoedas.',
    aliases: ['criptos', 'cryptos'],
    args: [{
      name: 'moeda (btc, eth, ltc)',
      required: false
    }]
  },
  run: async (client, message, args) => {
    /* let cooldown = client.database.crypto.get('lastUpdate') || 0;
    if ((cooldown + 60000 * 5) < Date.now()) {
      client.database.updatePurse();
      client.database.crypto.set('lastUpdate', Date.now());
    } */
    
    let db = client.database;
    let c = {
      bitcoin: ['BTC', 'BitCoins'],
      ethereum: ['ETH', 'Ethereums'],
      litecoin: ['LTC', 'LiteCoins']
    };
    let c2 = {
      btc: 'bitcoin',
      eth: 'ethereum',
      ltc: 'litecoin',
      bitcoins: 'bitcoin',
      ethereums: 'ethereum',
      litecoins: 'litecoin'
    };
      
    let coin = Object.keys(c).find((x) => x.includes(args[0]?.toLowerCase())) || c2[Object.keys(c2).find((x) => x.includes(args[0]?.toLowerCase()))] || 'bitcoin';
    
    if (!coin) return message.reply({ content: `(  ) › Eu não reconheço essa cryptomoeda, você pode tentar: \`${Object.keys(c).join(', ')}\`.` });
    
    let embeds = [];
    let rows = [];
    
    let build = async (crypto) => {
      let board = await db.convertPurse(crypto);
      let cUser = await db.getCrypto(crypto, message.author.id) || 0;
      let sf = await db.getMoney(message.author);
      // console.log(board, crypto, c[crypto]);
      let down = board.slice(0, 20).includes('arrow_down');
      let color = down ? 0xff6961 : 0x77dd77;
      let embed = new EmbedBuilder()
        .setTitle(`( <:stock:1158003079178879016> ) › Bolsa de valores — ${c[crypto][1]}`)
        .setColor(color)
        .setDescription('>>> ' + board)
        .setFooter({ text: `Última atualização: ${ms(Date.now() /* - client.database.crypto.get('lastUpdate')*/)}` });
      
      embeds = [embed];
      let row = new ActionRowBuilder();
      let vr = await db.getCrypto(crypto);
      if (sf >= vr[0]) {
        let buy = new ButtonBuilder()
          .setCustomId('buy')
          .setLabel('Comprar')
          .setStyle(down ? ButtonStyle.Success : ButtonStyle.Danger);
        row.addComponents(buy);
      };
      if (cUser) {
        let sale = new ButtonBuilder()
          .setCustomId('sale')
          .setLabel('Vender')
          .setStyle(down ? ButtonStyle.Danger : ButtonStyle.Success);
        row.addComponents(sale);
      }
        
      if (row.components.length !== 0) rows[0] = row;
    };
    await build(coin);
    const msg = await message.reply({ embeds: embeds, components: rows });
    let filter = (i) => {
      // i.deferUpdate();
      return i.user.id === message.author.id;
    };
    const collector = msg.createMessageComponentCollector({ filter: filter, componentType: ComponentType.Button, max: 1 });
    collector.on('collect', async (i) => {
      let id = i.customId;
      let crp = await db.getCrypto(coin, i.user.id) || 0;
      let mny = await db.getMoney(message.author);
      let crpp = await db.getCrypto(coin);
      let max = id === 'buy' ? Math.floor(mny / crpp[0]) : crp;
      let mesg = await i.reply({ content: `( <:amount:1158227619066675222> ) › Envie a quantidade de cryptomoedas você deja ${id === 'sale' ? 'vender' : 'comprar'}. **Max: \`${max}\`**` });
      let q = 0;
      let f2 = (m) => {
        if (m.author.id !== message.author.id) return false;
        let quantie = Number((m.content || 0).match(/[0-9]/g)?.join('')) || 0;
        let boo = true;
        if (m.author.id !== message.author.id) boo = false
          else if (quantie > max) boo = false
          else if (quantie <= 0) boo = false;
        if (boo) {
          q = quantie;
        } else {
          try {
            mesg.delete();
          } catch (err) {}
        }
        return boo;
      };
      let mclt = message.channel.createMessageCollector({ filter: f2, max: 1, time: 15000 });
      mclt.on('collect', async (m) => {
        crp = await db.getCrypto(coin, i.user.id) || 0;
        mny = await db.getMoney(message.author);
        crpp = await db.getCrypto(coin);
        let mp = q * crpp[0];
        
        let messages = {
          buy: () => {
            db.setCrypto(coin, crp + q, m.author.id);
            db.setMoney(m.author, Number('-' + mp));
            return `( <:buy:1158227181701431336> ) › Você comprou no total **${q} ${c[coin][1]}** por **${mp} Sapphires**.`;
          },
          sale: () => {
            db.setCrypto(coin, crp - q, m.author.id);
            db.setMoney(m.author, mp);
            return `( <:sell:1158227160306286632> ) › Você vendeu no total **${q} ${c[coin][1]}** por **${mp} Sapphires**.`;
          }
        };
        m.reply({ content: messages[id]() });
      });
    });
    collector.on('end', (r, cl) => {
      msg.edit({ components: [] });
    });
  }
}
