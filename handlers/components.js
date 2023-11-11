const { readdirSync } = require('fs');
const { log } = require('../functions');
const Client = require('../class/ExtendedClient');

module.exports = (client) => {};

/*
module.exports = (client) => {
    let cmp = [];
    for (const dir of readdirSync('./components/')) {
        for (const file of readdirSync('./components/' + dir).filter((f) => f.endsWith('.js'))) {
            const module = require('../components/' + dir + '/' + file);

            if (!module) continue;

            if (dir === 'buttons') {
                if (!module.customId || !module.run) {
                    log('Unable to load the component ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.', 'warn');

                    continue;
                };

                client.components.buttons.set(module.customId, module);
            } else if (dir === 'selects') {
                if (!module.customId || !module.run) {
                    log('Unable to load the select menu ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.', 'warn');

                    continue;
                };

                client.components.selects.set(module.customId, module);
            } else if (dir === 'modals') {
                if (!module.customId || !module.run) {
                    log('Unable to load the modal ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.', 'warn');

                    continue;
                };

                client.components.modals.set(module.customId, module);
            } else {
                log('Invalid component type: ' + file, 'warn');

                continue;
            };

          cmp.push(file.replace('.js', ''));
        };
    };
    log('Estes componentes foram carregados: ' + cmp.join(', '), 'info');
};
*/