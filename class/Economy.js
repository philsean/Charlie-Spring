const NexusDB = require("nexus.db");

module.exports = class Economy {
  constructor(client, modelName) {
    this.client = client;
    this.database = require(`../Models/${modelName || 'User'}`);
    this.cooldowns = new NexusDB.Database({ path: './Database/Cooldowns.json' });
    this.crypto = new NexusDB.Database({ path: './Database/Crypto.json' });
  }
  
  async getMoney (user) {
    let data = await this.database.findById(user.id);
    return (data ? data.economy.sapphire : 0) || 0;
  }
  
  async setMoney (user, value) {
    const money = await this.getMoney(user);
    await this.database.findByIdAndUpdate(user.id, {$set:{economy:{sapphire:money + value}}});
    return this.getMoney(user);
  }
    
  async getCooldown (user, cd) {
    let times = {
      daily: 86400000,
      work: 3600000
    }
    let cooldown = this.cooldowns.get(`${user.id}.${cd}`);
    return cooldown;
  }
  
  async setCooldown (user, cd) {
    let times = {
      daily: 86400000,
      work: 3600000
    }
    let time = Date.now() + (times[cd] || (typeof cd === 'number' ? cd : 0));
    this.cooldowns.set(`${user.id}.${typeof cd === 'number' ? 'custom' : cd}`, time);
    return this.getCooldown(user, (typeof cd === 'number' ? 'custom' : cd));
  }
  
  async getLeaderboard (user) {
    let data = await this.database.find({});
    let leaderboard = data.filter(x => x.economy.sapphire > 0).sort((a, b) => b.economy.sapphire - a.economy.sapphire);
    let res = {};
    res.leaderboard = leaderboard;
    if (user) res.userPosition = leaderboard.map(({ _id }, i) => { if (_id === user.id) return `${i + 1}` }).filter(y => y !== undefined)[0] || '+100';
    return res;
  }
  
  getCrypto (crypto, userId) {
     if (crypto && !userId) {
       return this.crypto.get(`bolsa.${crypto}`) || [];
     } else if (userId) {
       return this.crypto.get(`users.${userId}${crypto !== '' ? '.' + crypto : ''}`);
     } else {
       return this.crypto.get('bolsa');
     }
  }
  
  setCrypto (crypto, value, userId) {
    if (userId) {
      this.crypto.set(`users.${userId}.${crypto}`, value);
    } else {
      let arr = this.getCrypto(crypto);
      arr.unshift(value);
      this.crypto.set(`bolsa.${crypto}`, arr.slice(0, 10));
    }
    return this.crypto.get(`${userId ? 'users.' + userId : 'bolsa'}.${crypto}`);
  }
  
  addCrypto (crypto, value, userId) {
    let cryptos = this.getCrypto(crypto, userId) || 0;
    cryptos += value;
    return this.setCrypto(crypto, cryptos, userId);
  }
  
  convertPurse (crypto) {
    let cryptos = this.getCrypto(crypto);
    let converters = { bitcoin: 'BTC', ethereum: 'ETH', litecoin: 'LTC' };
    let board = cryptos.length === 0 ? 'A bolsa não tem valores ainda.' : cryptos.map((x, y, z) => `**( ${x === (z[y + 1] || 0) ? '<:arrow_point_rigth:1158002605121875979>' : (x > (z[y + 1] || 0) ? '<:arrow_up:1158002689205084220>' : '<:arrow_down:1158002647413035150>')} ) — ${x} ${converters[crypto] || 'Cryptomoedas'}** ${y === 0 ? '`— Valor atual.`' : ''}`).join('\n');
    return board;
  }
  
  updatePurse () {
    let bolsa = this.getCrypto();
    Object.entries(bolsa).map((x) => {
      let key = x[0];
      let value = x[1];
      let update = value.map((x, y, z) => x >= (z[y + 1] || 0)).shuffle();
      if (update.filter((x) => x === false).length <= 3) update = update.map((x) => !x)
      else if (update.filter((x) => x === true).length <= 4) update = update.map((x) => !x);
      update = update[0];
      let [min, max] = update ? [value[0], value[0] * 2] : [~~(value[0] / 2), value[0]];
      let random = Math.floor(Math.random() * (max - min + 1) + min);
      this.setCrypto(key, random);
    });
    return this.getCrypto();
  }
}