'use strict';

const client = require('./other/client');
const Settings = require('./settings/settings');
const Logger = require('./util/logger');
const Handler = require('./util/handle');
const Poll = require('./channels/poll');
const events = {
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
    if (!events[type])
        return;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);
    if (channel.messages.has(data.message_id))
        return;
    const message = await channel.fetchMessage(data.message_id);
    const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);
    client.emit(events[type], reaction, user);
});

client.on('message', msg => {
    if (msg.author.id === client.user.id || msg.channel.type !== 'text')
        return;
    const res = Handler.getArgs(msg);
    if (res) {
        Handler.handle(msg, res);
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    if (user.id === client.user.id || reaction.message.channel.type !== 'text')
        return;
    if (reaction.message.author.id === client.user.id) {
        Poll.handle(reaction, user, true);
    }
});

client.on('messageReactionRemove', (reaction, user) => {
    if (user.id === client.user.id || reaction.message.channel.type !== 'text')
        return;
    if (reaction.message.author.id === client.user.id) {
        Poll.handle(reaction, user, false);
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