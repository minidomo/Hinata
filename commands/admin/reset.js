'use strict';

const Settings = require('../../settings/settings');
const Topic = require('../../channels/topic').update;

module.exports = {
    name: 'reset',
    desc: 'Clears the activity, time, and participant list.',
    usage: 'reset',
    validate(msg, obj) {
        if (Settings.getChannelId(msg.guild.id) !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, obj) {
        Settings.clearParticipants(msg.guild.id);
        Settings.setActivityTime(msg.guild.id, '-');
        Settings.setActivityName(msg.guild.id, '-');
        Topic(msg.guild.id);
        msg.channel.send(`The activity, time, and participant list has been cleared.`);
    }
};