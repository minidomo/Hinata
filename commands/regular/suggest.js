'use strict';

const { Settings } = require('../../settings/settings');
const Topic = require('../../channels/topic').update;
const DateCheck = require('../../util/date');
const Poll = require('../../channels/poll');

module.exports = {
    name: 'suggest',
    desc: 'Suggest a date, time, and activity.',
    usage: 'suggest <date> <time> <activity>',
    validate(msg, { args }) {
        const guildSettings = Settings.get(msg.guild.id);
        if (guildSettings.channel.id !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (args.length < 3) {
            msg.channel.send(`Correct usage is \`${guildSettings.prefix}${this.usage}\``)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        const [date, time, ...left] = args;
        const activity = left.join(' ');
        if (!DateCheck.checkDate(msg, date, time))
            return false;
        const suggestions = guildSettings.suggest_system.suggestions.array();
        if (suggestions.length === 10) {
            msg.channel.send('Sorry but the poll is full.')
                .then(feedback => feedback.delete(2000));
            return false;
        }
        const format = DateCheck.getMoment(date, time).format('M/D h:mm A');
        if (suggestions.find(suggestion => suggestion.time === format && suggestion.name.toLowerCase() === activity.toLowerCase())) {
            msg.channel.send('This has already been suggested.')
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, { args }) {
        const [date, time, ...left] = args;
        const activity = left.join(' ');
        const guild_id = msg.guild.id;
        const guildSettings = Settings.get(guild_id);
        const suggest_system = guildSettings.suggest_system;
        suggest_system.suggestions.add(date, time, activity, msg.author.username);
        Topic(guild_id);
        msg.channel.send('Suggestion added.')
            .then(feedback => feedback.delete(2000));
        const suggestion = suggest_system.suggestions.array();
        if (suggestion.length === 2) {
            Poll.create(guild_id)
                .then(Poll.update);
        } else if (suggestion.length > 2) {
            Poll.update(guild_id);
        }
    }
};