'use strict';

const Settings = require('../../settings/settings');
const Add = require('../regular/add');

module.exports = {
    name: 'addname',
    desc: 'Adds someone to the participant list.',
    usage: 'addname <name>',
    validate(msg, { args }) {
        if (args.length === 0) {
            msg.channel.send(`Correct usage is \`${Settings.getPrefix(msg.guild.id)}${this.usage}\``)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        const name = args.join(' ');
        return Add.validate(msg, null, name);
    },
    execute(msg, { args }) {
        const name = args.join(' ');
        Add.execute(msg, null, name);
    }
};