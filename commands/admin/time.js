'use strict';

const { Settings } = require('../../settings/settings');
const Topic = require('../../channels/topic').update;
const DateCheck = require('../../util/date');

module.exports = {
    name: 'time',
    desc: 'Sets the date and time for the activity.',
    usage: 'time <date> <time>',
    validate(msg, { args }) {
        const guildSettings = Settings.get(msg.guild.id);
        if (guildSettings.channel.id !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (args.length !== 2) {
            msg.channel.send(`Correct usage is \`${guildSettings.prefix}${this.usage}\``)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return DateCheck.checkDate(msg, args[0], args[1]);
    },
    execute(msg, { args }) {
        const [date, time] = args;
        const format = DateCheck.getMoment(date, time).format('M/D h:mm A');
        Settings.get(msg.guild.id).activity.time = format;
        Topic(msg.guild.id);
        msg.channel.send(`The time has been set to: **${format}**`);
    }
};