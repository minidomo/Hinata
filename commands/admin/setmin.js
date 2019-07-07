'use strict';

const Settings = require('../../settings/settings');

module.exports = {
    name: 'setmin',
    desc: 'Sets the minimum votes for a suggestion to end the poll.',
    usage: 'setmin <number>',
    validate(msg, { args }) {
        if (args.length !== 1) {
            msg.channel.send(`Correct usage is \`${Settings.getPrefix(msg.guild.id)}${this.usage}\``)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (/^\d+$/.test(args[0])) {
            return true;
        }
        msg.channel.send(`Invalid number.`)
            .then(feedback => feedback.delete(2000));
        return false;
    },
    execute(msg, { args }) {
        const num = Math.max(1, parseInt(args[0]));
        Settings.setSuggestMinimum(msg.guild.id, num);
        msg.channel.send(`The minimum votes has been changed to: ${num}`);
        // update poll?
    }
};