'use strict';

const { Settings } = require('../../settings/settings');
const Topic = require('../../channels/topic').update;

module.exports = {
    name: 'pclear',
    desc: 'Clears the participant list.',
    usage: 'pclear',
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
        Settings.get(msg.guild.id).activity.participants.clear();
        Topic(msg.guild.id);
        msg.channel.send('The participant list has been cleared.');
    }
};