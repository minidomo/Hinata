'use strict';

const Settings = require('../../settings/settings');
const Topic = require('../../channels/topic');

module.exports = {
    name: 'remove',
    desc: 'Remove yourself from the participant list.',
    usage: 'remove',
    validate(msg, obj, user) {
        user = user || msg.author.username;
        if (!Settings.getChannelId(msg.guild.id)) {
            msg.channel.send(`A channel must be set up to use this command.`)
                .then(feedback => feedback.delete(2000));
            return false;
        } else if (!Settings.hasParticipant(msg.guild.id, user)) {
            msg.channel.send(`**${user}** has not been added to the participant list.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, obj, user) {
        user = user || msg.author.username;
        Settings.removeParticipant(msg.guild.id, user);
        msg.channel.send(`**${user}** has been removed from the participant list.`)
            .then(feedback => feedback.delete(2000));
        Topic(msg.guild.id);
    }
};