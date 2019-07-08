'use strict';

const Settings = require('../../settings/settings');
const Topic = require('../../channels/topic');
const DateCheck = require('../../util/date');
const StringFormat = require('../../util/stringformat');
const Poll = require('../../channels/poll');

module.exports = {
    name: 'suggest',
    desc: 'Suggest a date, time, and activity.',
    usage: 'suggest <date> <time> <activity>',
    validate(msg, { args }) {
        if (Settings.getChannelId(msg.guild.id) !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (args.length < 3) {
            msg.channel.send(`Correct usage is \`${Settings.getPrefix(msg.guild.id)}${this.usage}\``)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        const [date, time, ...left] = args;
        const activity = left.join(' ');
        if (!DateCheck.checkDate(msg, date, time))
            return false;
        const guild_id = msg.guild.id;
        const suggestions = Settings.getSuggestions(guild_id);
        if (suggestions.length === 10) {
            msg.channel.send('Sorry but the poll is full.')
                .then(feedback => feedback.delete(2000));
            return false;
        }
        const format = DateCheck.getMoment(date, time).format('M/D h:mm A');
        if (suggestions.find(suggestion => suggestion.date === format && suggestion.name.toLowerCase() === activity.toLowerCase())) {
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
        Settings.addSuggestion(guild_id, date, time, StringFormat.capitalize(activity), msg.author.username);
        Topic(guild_id);
        msg.channel.send('Suggestion added.')
            .then(feedback => feedback.delete(2000));
        const suggestion = Settings.getSuggestions(guild_id);
        if (suggestion.length === 2) {
            Poll.create(guild_id)
                .then(Poll.update);
        } else if (suggestion.length > 2) {
            Poll.update(guild_id);
        }
    }
};