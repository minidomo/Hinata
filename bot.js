'use strict';

const Discord = require('discord.js');
const Logger = require('./util/logger');
const Settings = require('./settings/settings');
const { token } = require('./config.json');

const client = new Discord.Client();

client.once('ready', () => {
    require('./initialize')(client);
    Logger.log(`Logged in as ${client.user.tag}`);
});

client.on('raw', event => {

});

client.on('message', msg => {
    if (msg.author.id === client.user.id)
        return;

});

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot)
        return;
    if (reaction.message.author.bot) {

    }
});

client.on('messageReactionRemove', (reaction, user) => {
    if (user.bot)
        return;
    if (reaction.message.author.bot) {

    }
});

client.login(token);

const exit = () => {
    process.exit(0);
};

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('uncaughtException', err => {
    Logger.realError(err);
    exit();
});