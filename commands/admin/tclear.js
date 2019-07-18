'use strict';

const { Settings } = require('../../settings/settings');
const Class = require('../../structs/Class');
const Topic = require('../../channels/topic').update;

module.exports = {
    name: 'tclear',
    desc: 'Clears the time.',
    usage: 'tclear',
    validate(msg, obj) {
        if (Settings.get(msg.guild.id).channel.id !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, obj) {
        Settings.get(msg.guild.id).activity.time = Class.Activity.DEFAULT_EMPTY();
        Topic(msg.guild.id);
        msg.channel.send(`The time has been cleared.`);
    }
};