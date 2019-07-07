'use strict';

/**
 * @typedef {object} Channel
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {object} SuggestSystem
 * @property {number} minimum
 * @property {string[]} suggestions
 * @property {string} message_id
 * @property {Map<string, number>} votes
 * @property {Map<string, string>} user_votes
 */

/**
 * @typedef {object} Activity
 * @property {string} name
 * @property {?time} time
 * @property {string[]} participants
 */

/**
 * @typedef {object} GuildSettings
 * @property {string} name
 * @property {string} prefix
 * @property {Channel} channel
 * @property {SuggestSystem} suggest_system
 * @property {Activity} activity
 */

const Discord = require('discord.js');
const Logger = require('../util/logger');
const Settings = require('./settings.json') || {};

const fs = require('fs');

const settings = {};

/**
 * @type {Discord.Client}
 */
let client;

settings.load = () => {
    Logger.log('Loading settngs...');
    const jsonToMap = jsonStr => new Map(JSON.parse(jsonStr));
    const removeGuilds = new Set(Object.keys(Settings));
    client.guilds.forEach((value, guild_id, map) => {
        if (removeGuilds.has(guild_id)) {
            removeGuilds.delete(guild_id);
            const guild = settings.getGuild(guild_id);
            guild.name = map.get(guild_id).name;
            guild.suggest_system.votes = jsonToMap(guild.suggest_system.votes);
            guild.suggest_system.user_votes = jsonToMap(guild.suggest_system.user_votes);
        } else {
            settings.addGuild(guild_id);
        }
    });
    removeGuilds.forEach(guild_id => settings.removeGuild(guild_id));
    Logger.log('Finished loading settings');
};

settings.save = () => {
    const mapToJson = map => JSON.stringify([...map]);
    Object.keys(Settings).forEach(value => {
        const guild = Settings[value];
        guild.suggest_system.votes = mapToJson(guild.suggest_system.votes);
        guild.suggest_system.user_votes = mapToJson(guild.suggest_system.user_votes);
    });
    Logger.log('Saving settings...');
    fs.writeFileSync('./settings/settings.json', JSON.stringify(Settings, null, 4));
    Logger.log('Finished saving settings');
};

settings.setClient = cl => {
    if (client)
        return;
    client = cl;
};

settings.getClient = () => {
    return client;
}

/**
 * @returns {GuildSettings}
 */
settings.getGuild = guild_id => {
    return Settings[guild_id];
};

settings.addGuild = guild_id => {
    if (settings.getGuild(guild_id))
        return false;
    Settings[guild_id] = {
        name: client.guilds.get(guild_id).name,
        prefix: "/",
        channel: {
            id: null,
            name: null
        },
        suggest_system: {
            minimum: 4,
            suggestions: [],
            message_id: null,
            votes: new Map(),
            user_votes: new Map()
        },
        activity: {
            name: null,
            time: "None Set",
            participants: []
        }
    };
    return true;
};

settings.removeGuild = guild_id => {
    if (settings.getGuild(guild_id)) {
        delete Settings[guild_id];
        return true;
    }
    return false;
};

settings.getName = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.name : null;
};

settings.setName = (guild_id, name) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.name = name;
        return true;
    }
    return false;
};

settings.getPrefix = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.prefix : null;
};

settings.setPrefix = (guild_id, prefix) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.prefix = prefix;
        return true;
    }
    return false;
};

settings.getChannelId = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.channel.id : null;
};

settings.setChannelId = (guild_id, channel_id) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.channel.id = channel_id;
        return true;
    }
    return false;
};

settings.getChannelName = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.channel.name : null;
};

settings.setChannelName = (guild_id, channel_name) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.channel.name = channel_name;
        return true;
    }
    return false;
};

settings.getSuggestMinimum = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.suggest_system.minimum : null;
};

settings.setSuggestMinimum = (guild_id, min) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.suggest_system.minimum = min;
        return true;
    }
    return false;
};

settings.getSuggestions = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.suggest_system.suggestions.slice() : null;
};

settings.clearSuggestions = guild_id => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.suggest_system.suggestions = [];
        return true;
    }
    return false;
};

settings.getMessageId = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.suggest_system.message_id : null;
};

settings.setMessageId = (guild_id, message_id) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.suggest_system.message_id = message_id;
        return true;
    }
    return false;
};

settings.getVotes = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? new Map(guild.suggest_system.votes) : null;
};

settings.addVote = (guild_id, emote) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        const votes = guild.suggest_system.votes;
        if (!votes.has(emote))
            votes.set(emote, 0);
        votes.set(emote, votes.get(emote) + 1);
        return true;
    }
    return false;
};

settings.removeVote = (guild_id, emote) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        const votes = guild.suggest_system.votes;
        if (votes.has(emote)) {
            votes.set(emote, votes.get(emote) - 1);
            return true;
        }
    }
    return false;
}

settings.clearVotes = guild_id => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.suggest_system.votes.clear();
        return true;
    }
    return false;
};

settings.getUserVotes = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? new Map(guild.suggest_system.user_votes) : null;
};

settings.addUserVote = (guild_id, user_id, emote) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        const user_votes = guild.suggest_system.user_votes;
        user_votes.set(user_id, emote);
        return true;
    }
    return false;
};

settings.removeUserVote = (guild_id, user_id) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        const user_votes = guild.suggest_system.user_votes;
        if (user_votes.has(user_id)) {
            user_votes.delete(user_id);
            return true;
        }
    }
    return false;
};

settings.clearUserVotes = guild_id => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.suggest_system.user_votes.clear();
        return true;
    }
    return false;
};

settings.getActivityName = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.activity.name : null;
};

settings.setActivityName = (guild_id, name) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.activity.name = name;
        return true;
    }
    return false;
};

settings.getActivityTime = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.activity.time : null;
};

settings.setActivityName = (guild_id, time) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.activity.time = time;
        return true;
    }
    return false;
};

settings.getActivityParticipants = guild_id => {
    // no setter or adder
    const guild = settings.getGuild(guild_id);
    return guild ? guild.activity.participants.slice() : null;
};

module.exports = settings;