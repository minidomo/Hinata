'use strict';

const Settings = require('../../settings/settings');
const Setup = require('../../channels/setup');

module.exports = {
    name: 'setup',
    desc: 'Sets up the current channel.',
    usage: 'setup',
    validate(msg, obj) {
        if (msg.channel.id === Settings.getChannelId(msg.guild.id)) {
            msg.channel.send('This channel is already set up.')
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, obj) {
        msg.channel.send('Setting up this channel.')
            .then(feedback => {
                Setup(msg);
                feedback.delete(2000);
            });
    }
};