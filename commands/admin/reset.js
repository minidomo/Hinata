'use strict';

const { Settings } = require('../../settings/settings');
const Class = require('../../structs/Class');
const Topic = require('../../channels/topic').update;

module.exports = {
    name: 'reset',
    desc: 'Clears the activity, time, and participant list.',
    usage: 'reset',
    validate(msg, obj) {
        const guildSettings = Settings.get(msg.guild.id);
        if (guildSettings.channel.id !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, obj) {
        const activity = Settings.get(msg.guild.id).activity;
        activity.participants.clear();
        activity.time = activity.name = Class.Activity.DEFAULT_EMPTY();
        Topic(msg.guild.id);
        msg.channel.send(`The activity, time, and participant list has been cleared.`);
    }
};