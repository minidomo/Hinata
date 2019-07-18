'use strict';

const { Settings } = require('../../settings/settings');
const Remove = require('../regular/remove');

module.exports = {
    name: 'rname',
    desc: 'Removes someone to the participant list.',
    usage: 'rname <name>',
    validate(msg, { args }) {
        if (args.length === 0) {
            msg.channel.send(`Correct usage is \`${Settings.get(msg.guild.id).prefix}${this.usage}\``)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        const name = args.join(' ');
        return Remove.validate(msg, null, name);
    },
    execute(msg, { args }) {
        const name = args.join(' ');
        Remove.execute(msg, null, name);
    }
};