const rpg = require('../Models/RPG.js');

module.exports = class CharlieRPG {
  #client;
  
  constructor (client) {
    this.#client = client;
    this.db = rpg;
  }
    
  async getUser (userId) {
    let user = await this.db.findOne({ _id: userId }) || false;
    return user;
  }
  
  async createUser (userId, info) {
    info._id = userId;
    try {
      await this.db.create(info)
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}