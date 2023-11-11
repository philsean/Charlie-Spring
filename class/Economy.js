const NexusDB = require("nexus.db");

module.exports = class Economy {
  constructor(client, modelName) {
    this.client = client;
    this.database = require(`../Models/${modelName || 'User'}`);
    this.cooldowns = new NexusDB.Database({ path: './Database/Cooldowns.json' });
    this.crypto = require(`../Models/Crypto.js`);
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
  
  async getCrypto (crypto, userId) {
    let cryptos = await this.crypto.find();
     if (crypto && !userId) {
       return cryptos[crypto] || [];
     } else if (userId) {
       let us = await this.database.findById(userId);
       let r = { bitcoin: (us.bitcoin || 0), ethereum: (us.ethereum || 0), litecoin: (us.litecoin || 0) };
       if (crypto) r = r[crypto];
       return r;
     } else {
       return cryptos;
     }
  }
  
  async setCrypto (crypto, value, userId) {
    if (userId) {
      let data = await this.database.findById(userId);
      data[crypto] = value;
      data.save();
    } else {
      let cryptos = await this.crypto.find();
      let arr = cryptos[crypto].slice(0, 9);
      arr.unshift(value);
      cryptos.save();
    }
    return true;
  }
  
  async addCrypto (crypto, value, userId) {
    let cryptos = await this.getCrypto(crypto, userId) || 0;
    cryptos += value;
    return await this.setCrypto(crypto, cryptos, userId);
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
