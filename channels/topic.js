'use strict';

const client = require('../other/client');
const Logger = require('../util/logger');

const regex = /\n*\d+\/10 Suggestions \| Activity: .+ \| Time: .+ \| Participants: \d+ \|(?:.|\n)*$/;

module.exports = async guild_id => {
    try {
        const Settings = require('../settings/settings');
        const channel = client.guilds.get(guild_id).channels.get(Settings.getChannelId(guild_id));
        let currentTopic = channel.topic || '';
        if (regex.test(currentTopic))
            [currentTopic] = currentTopic.split(regex);
        const participants = Settings.getActivityParticipants(guild_id);
        const description = `${currentTopic}\n`
            + `${Settings.getSuggestions(guild_id).length}/10 Suggestions | `
            + `Activity: ${Settings.getActivityName(guild_id)} | `
            + `Time: ${Settings.getActivityTime(guild_id)} | `
            + `Participants: ${participants.length} |`
            + `\n${participants.join(', ') || '-'}`;
        await channel.setTopic(description);
    } catch (err) {
        throw err;
    }
};