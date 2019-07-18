'use strict';

const { Settings } = require('../../settings/settings');
const Add = require('../regular/add');

module.exports = {
    name: 'aname',
    desc: 'Adds someone to the participant list.',
    usage: 'aname <name>',
    validate(msg, { args }) {
        if (args.length === 0) {
            msg.channel.send(`Correct usage is \`${Settings.get(msg.guild.id).prefix}${this.usage}\``)
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