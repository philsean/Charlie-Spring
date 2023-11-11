const { REST, Routes } = require("discord.js");
const { log } = require("../functions");
const config = require("../config");
const Client = require('../class/ExtendedClient');

module.exports = async (client) => {
    const rest = new REST({ version: '10' }).setToken(config.client.token);

    try {
        log('Iniciado o carregamento de comandos slash... (this might take minutes!)', 'warn');

        await rest.put(Routes.applicationCommands(config.client.id), {
            body: client.applicationcommandsArray
        });

        log('Comandos de aplicativo carregados com êxito para a Discord API.', 'done');
    } catch (e) {
        log('Unable to load application commands to Discord API.', 'err');
    };
};