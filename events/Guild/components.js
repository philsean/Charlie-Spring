const config = require('../../config');
const { log } = require('../../functions');
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    event: 'interactionCreate',
    run: (client, interaction) => {
        if (interaction.isButton()) {
            const component = client.components.buttons.get(interaction.customId);

            if (!component) return;

            try {
                component.run(client, interaction);
            } catch (error) {
                log(error, 'error');
            }

            return;
        };

        if (interaction.isAnySelectMenu()) {
            const component = client.components.selects.get(interaction.customId);

            if (!component) return;

            try {
                component.run(client, interaction);
            } catch (error) {
                log(error, 'error');
            }

            return;
        };

        if (interaction.isModalSubmit()) {
            const component = client.components.modals.get(interaction.customId);

            if (!component) return;

            try {
                component.run(client, interaction);
            } catch (error) {
                log(error, 'error');
            }

            return;
        };
    },
};