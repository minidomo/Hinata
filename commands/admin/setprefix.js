'use strict';

const Settings = require('../../settings/settings');

module.exports = {
    name: 'setprefix',
    desc: 'Sets the prefix of the bot.',
    usage: 'setprefix <prefix>',
    validate(msg, { args }) {
        if (args.length !== 1) {
            msg.channel.send(`Correct usage is \`${Settings.getPrefix(msg.guild.id)}${this.usage}\``)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (/^[^\w\d\s]+$/.test(args[0])) {
            return true;
        }
        msg.channel.send(`Invalid prefix. Prefix cannot include letters, numbers, whitespace, or underscores.`)
            .then(feedback => feedback.delete(2000));
        return false;
    },
    execute(msg, { args }) {
        Settings.setPrefix(msg.guild.id, args[0]);
        msg.channel.send(`Prefix has been changed to: \`${args[0]}\``);
    }
}; 