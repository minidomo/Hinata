'use strict';

const { Settings } = require('../../settings/settings');
const Poll = require('../../channels/poll');

module.exports = {
    name: 'endpoll',
    desc: 'Force ends the current poll.',
    usage: 'endpoll',
    validate(msg, obj) {
        const guild_id = msg.guild.id;
        const guildSettings = Settings.get(guild_id);
        if (guildSettings.channel.id !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (!Poll.exists(guild_id)) {
            msg.channel.send(`There must be an active poll to use this command.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, obj) {
        Poll.forceEnd(msg.guild.id);
        msg.channel.send(`The poll has been ended by **${msg.author.username}**`);
    }
};