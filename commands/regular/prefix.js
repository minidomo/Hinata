'use strict';

const Settings = require('../../settings/settings');

module.exports = {
    name: 'prefix',
    desc: 'Shows the prefix of the bot.',
    usage: 'prefix',
    validate(msg, obj) {
        return true;
    },
    execute(msg, obj) {
        msg.channel.send(`The prefix is: \`${Settings.getPrefix(msg.guild.id)}\``)
            .then(feedback => feedback.delete(2000));
    }
};