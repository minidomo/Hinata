'use strict';

const client = require('../other/client');

const regex = /\n*\d+\/10 Suggestions \| Activity: .+ \| Time: .+ \| Participants: \d+ \|(?:.|\n)*$/;

module.exports = {
    async update(guild_id) {
        try {
            const { Settings } = require('../settings/settings');
            const guildSettings = Settings.get(guild_id);
            const channel = client.guilds.get(guild_id).channels.get(guildSettings.channel.id);
            let currentTopic = channel.topic || '';
            if (regex.test(currentTopic))
                [currentTopic] = currentTopic.split(regex);
            const participants = guildSettings.activity.participants.array();
            const description = `${currentTopic}\n`
                + `${guildSettings.suggest_system.suggestions.size()}/10 Suggestions | `
                + `Activity: ${guildSettings.activity.name} | `
                + `Time: ${guildSettings.activity.time} | `
                + `Participants: ${participants.length} |`
                + `\n${participants.join(', ') || ''}`;
            await channel.setTopic(description);
        } catch (err) {
            throw err;
        }
    },
    async clean(guild_id) {
        try {
            const { Settings } = require('../settings/settings');
            const guildSettings = Settings.get(guild_id);
            const channel = client.guilds.get(guild_id).channels.get(guildSettings.channel.id);
            let currentTopic = channel.topic || '';
            if (regex.test(currentTopic))
                [currentTopic] = currentTopic.split(regex);
            await channel.setTopic(currentTopic);
        } catch (err) {
            throw err;
        }
    }
};