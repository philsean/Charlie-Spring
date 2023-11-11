const { readdirSync } = require('fs');
const { log } = require('../functions');
const ExtendedClient = require('../class/ExtendedClient');

module.exports = (client) => {
    let cmds = []
    for (const type of readdirSync('./commands/')) {
        for (const dir of readdirSync('./commands/' + type)) {
            for (const file of readdirSync('./commands/' + type + '/' + dir).filter((f) => f.endsWith('.js'))) {
                const module = require('../commands/' + type + '/' + dir + '/' + file);

                if (!module) continue;

                if (type === 'prefix') {
                    if (!module.structure?.name || !module.run) {
                        log('Unable to load the command ' + file +' due to missing \'structure#name\' or/and \'run\' properties.', 'warn');
        
                        continue;
                    };
                    module.structure.categorie = dir;
                    client.commands.prefix.set(module.structure.name, module);

                    if (module.structure.aliases && Array.isArray(module.structure.aliases)) {
                        module.structure.aliases.forEach((alias) => {
                            client.commands.aliases.set(alias, module.structure.name);
                        });
                    };
                } else {
                    if (!module.structure?.name || !module.run) {
                        log('Unable to load the command ' + file +' due to missing \'structure#name\' or/and \'run\' properties.', 'warn');
        
                        continue;
                    };

                    client.commands.slash.set(module.structure.name, module);
                    client.applicationCommandsArray.push(module.structure);
                };

                cmds.push(file.replace('.js', ''));
            };
        };
    };
    log('Estes comandos foram carregados: ' + cmds.join(', '), 'info');
};
