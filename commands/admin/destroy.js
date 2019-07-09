'use strict';

const Settings = require('../../settings/settings');
const Topic = require('../../channels/topic').clean;

module.exports = {
    name: 'destroy',
    desc: 'Reverses the effects of `setup`.',
    usage: 'destroy',
    validate(msg, obj) {
        if (Settings.getChannelId(msg.guild.id) !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, obj) {
        const guild_id = msg.guild.id;
        msg.channel.send('Reversing the effects of `setup`')
            .then(feedback => {
                Topic(guild_id);
                Settings.setChannelId(guild_id, null);
                Settings.setChannelName(guild_id, null);
                feedback.delete(2000);
            });
    }
};