const { connect } = require("mongoose");
const config = require("../config");
const { log } = require("../functions");

module.exports = async () => {
    log('Se conectando ao MongoDB...', 'warn');

    await connect(process.env.MONGODB_URI || config.handler.mongodb.uri).then(() => {
        log('MongoDB está conectado ao atlas!', 'done')
    });
};