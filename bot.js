'use strict';

const client = require('./other/client');
const Settings = require('./settings/settings');
const Logger = require('./util/logger');
const Handler = require('./util/handle');
const Poll = require('./channels/poll');
const Events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};

client.once('ready', () => {
    Settings.load();
    client.user.setActivity('Volleyball!');
    Logger.info(`Logged in as ${client.user.tag}`);
});

client.on('raw', async event => {
    const { t: type, d: data } = event;
    if (!Events[type])
        return;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);
    const message = channel.messages.get(data.message_id) || await channel.fetchMessage(data.message_id);
    const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);
    if (user.id === client.user.id || reaction.message.channel.type !== 'text')
        return;
    if (reaction.message.author.id === client.user.id) {
        Poll.handle(reaction, user, Events[type] === Events.MESSAGE_REACTION_ADD);
    }
});

client.on('message', msg => {
    if (msg.author.id === client.user.id || msg.channel.type !== 'text')
        return;
    const res = Handler.getArgs(msg);
    if (res) {
        Handler.handle(msg, res);
    }
});

const exit = () => {
    Settings.save();
    process.exit(0);
};

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('uncaughtException', err => {
    Logger.error(`${err.name} - ${err.message}`);
    if (err.stack)
        Logger.error(err.stack);
    exit();
});