'use strict';

const Settings = require('../../settings/settings');

module.exports = {
    name: 'min',
    desc: 'Shows the minimum votes for a suggestion to end the poll.',
    usage: 'min',
    validate(msg, obj) {
        return true;
    },
    execute(msg, obj) {
        msg.channel.send(`The minimum votes is: ${Settings.getSuggestMinimum(msg.guild.id)}`)
            .then(feedback => feedback.delete(2000));
    }
};