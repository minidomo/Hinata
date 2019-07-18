'use strict';

const { Settings } = require('../../settings/settings');
const Topic = require('../../channels/topic').clean;

module.exports = {
    name: 'destroy',
    desc: 'Reverses the effects of `setup`.',
    usage: 'destroy',
    validate(msg, obj) {
        const guildSettings = Settings.get(msg.guild.id);
        if (guildSettings.channel.id !== msg.channel.id) {
            msg.channel.send(`This channel must be set up to use this command here.`)
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    },
    execute(msg, obj) {
        const guild_id = msg.guild.id;
        msg.channel.send('Reversing the effects of `setup`')
            .then(feedback => {
                Topic(guild_id);
                const guildSettings = Settings.get(guild_id);
                guildSettings.channel.clear();
                guildSettings.activity.clear();
                guildSettings.suggest_system.clear();
                feedback.delete(2000);
            });
    }
};