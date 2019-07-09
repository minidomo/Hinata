'use strict';

const Settings = require('../../settings/settings');
const Topic = require('../../channels/topic').update;
const StringFormat = require('../../util/stringformat');

module.exports = {
    name: 'setactivity',
    desc: 'Sets the activity.',
    usage: 'setactivity <activity',
    validate(msg, { args }) {
        if (Settings.getChannelId(msg.guild.id) !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (args.length === 0) {
            msg.channel.send(`Correct usage is \`${Settings.getPrefix(msg.guild.id)}${this.usage}\``)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, { args }) {
        const full = args.join(' ');
        const fixed = StringFormat.capitalize(full);
        Settings.setActivityName(msg.guild.id, fixed);
        Topic(msg.guild.id);
        msg.channel.send(`The activity has been changed to: **${fixed}**`);
    }
};