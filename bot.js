'use strict';

const client = require('./other/client');
const Settings = require('./settings/settings');
const Logger = require('./util/logger');
const Handler = require('./other/handle');


client.once('ready', () => {
    Settings.load();
    client.user.setActivity('Volleyball!');
    Logger.log(`Logged in as ${client.user.tag}`);
});

client.on('raw', event => {

});

client.on('message', msg => {
    if (msg.author.id === client.user.id)
        return;
    const res = Handler.getArgs(msg);
    if (res) {
        Handler.handle(msg, res);
    }
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

const exit = () => {
    Settings.save();
    process.exit(0);
};

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('uncaughtException', err => {
    Logger.realError(err);
    exit();
});