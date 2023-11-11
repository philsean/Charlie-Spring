require('dotenv').config();
const Client = require('./class/ExtendedClient');
const client = new Client();

const express = require('express');
const app = express();

let requests = 0;
app.get('/', (req, res) => res.status(200).send('Requests: ' + ++requests));

client.start();

app.listen(3000, () => {
  console.log('( EXPRESS ) › Ouvindo na porta: ' + 3000);
});

Array.prototype.shuffle = function () {
  return this.sort(() => 0.5 - Math.random());
};

process.on('unhandledRejection', console.log);
process.on('uncaughtException', console.log);