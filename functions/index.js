const chalk = require('chalk');

const convertMS = (time) => {
        time = Math.round(time / 1000);
        const s = time % 60,
            m = Math.floor((time / 60) % 60),
            h = Math.floor((time / 60 / 60) % 24),
            d = Math.floor(time / 60 / 60 / 24);
        return {
            d: d,
            h: h,
            m: m,
            s: s
        }
    }
const log = (string, style) => {
    switch (style) {
        case 'info': {
            console.log(chalk.blue('[ ℹ ] › ' + string));

            break;
        };

        case 'err': {
            console.error(chalk.red('[ ❌ ] › ' + string));

            break;
        };

        case 'warn': {
            console.warn(chalk.yellow('[ ⚠ ] › ' + string));

            break;
        };

        case 'done': {
            console.log(chalk.green('[ ✅ ] › ' + string));

            break;
        };

        default: {
            console.log(string);

            break;
        };
    };
};

const time = (time, style) => {
    return `<t:${Math.floor(time / 1000)}${style ? `:${style}` : ''}>`;
};

module.exports = {
    log,
    time,
    convertMS
    
};
