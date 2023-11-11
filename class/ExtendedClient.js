const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongoose = require("../handlers/mongoose");
const components = require("../handlers/components");
const Economy = require('./Economy');
const { ActivityType } = require("discord.js");

module.exports = class extends Client {
    commands = {
      slash: new Collection(),
      aliases: new Collection(),
      prefix: new Collection()
    };
    components = {
      buttons: new Collection(),
      selects: new Collection(),
      modals: new Collection()
    };
    
    applicationCommandsArray = [];

    constructor() {
        super({
            intents: [Object.keys(GatewayIntentBits)],
            partials: [Object.keys(Partials)],
            presence: {
                activities: [{
                    name: '🌻 › Uma flor para outra flor.',
                    type: ActivityType.Custom,
                    state: '🌻 › Uma flor para outra flor.'
                }]
            }
        });

      this.rpg = new (require('./RPG.js'))(this);
      this.database = new Economy(this);
      this.games = {
        tictactoe: new Map(),
        2048: new Map(),
        wordle: new Map(),
        uno: new Map(),
        hangman: new Map(),
        connect4: new Map(),
        anagrama: new Map(),
        matching: new Map(),
        maze: new Map()
      };
      this.emoji = {
        x: '<:STL_X:1129745080413069412>'
      };
    };

    start = async () => {
        commands(this);
        events(this);
        components(this);
        if (config.handler.mongodb.toggle) mongoose();

        await this.login(config.client.token);
        
        if (config.handler.deploy) deploy(this, config);
    };

    findUser = (search, message) => {
      let users = this.users.cache;
      let user = !search.replaceAll(' ', '') ? (message ? message.author : false) : (users.find(({ id, username, displayName }) => search == id || username == search || displayName == search || username.startsWith(search) || displayName?.startsWith(search) || username.includes(search) || displayName?.includes(search)) || (message ? (message.mentions.members.size ? message.mentions.members.first().user : message.author) : undefined) || false);
      return user || (message ? message.author : false);
    }
};
