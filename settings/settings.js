'use strict';

/**
 * @typedef {object} Channel
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {object} Suggestion
 * @property {string} date
 * @property {string} name
 * @property {string} author
 */

/**
 * @typedef {object} SuggestSystem
 * @property {number} minimum
 * @property {Suggestion[]} suggestions
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

const client = require('../other/client');

const moment = require('moment');
const Logger = require('../util/logger');
const Topic = require('../channels/topic').update;
const Settings = require('./settings.json') || {};

const fs = require('fs');

const settings = {};

const removeGuilds = new Set(Object.keys(Settings));
const jsonToMap = jsonStr => new Map(JSON.parse(jsonStr));
const mapToJson = map => map.size > 0 ? JSON.stringify([...map]) : "[]";

client.on('guildCreate', guild => {
    Logger.info(`Creating settings for ${guild.name} (${guild.id})`);
    settings.addGuild(guild.id);
});

client.on('guildDelete', guild => {
    Logger.info(`Deleting settings for ${guild.name} (${guild.id})`);
    delete Settings[guild.id];
});

settings.load = () => {
    Logger.info('Loading settings...');
    client.guilds.forEach((value, guild_id, map) => {
        if (removeGuilds.has(guild_id)) {
            removeGuilds.delete(guild_id);
            const guild = settings.getGuild(guild_id);
            const realGuild = map.get(guild_id);
            guild.name = realGuild.name;
            guild.suggest_system.votes = jsonToMap(guild.suggest_system.votes);
            guild.suggest_system.user_votes = jsonToMap(guild.suggest_system.user_votes);
            if (guild.channel.id) {
                if (realGuild.channels.has(guild.channel.id)) {
                    if (settings.getMessageId(guild_id)) {
                        const channel = realGuild.channels.get(guild.channel.id);
                        channel.fetchMessage(settings.getMessageId(guild_id))
                            .then(() => {
                                channel.messages.clear();
                            })
                            .catch(() => {
                                settings.clearSuggestions(guild_id);
                                settings.setMessageId(guild_id, null);
                                settings.clearVotes(guild_id);
                                settings.clearUserVotes(guild_id);
                            });
                    }
                    Topic(guild_id);
                } else {
                    settings.setChannelId(guild_id, null);
                    settings.setChannelName(guild_id, null);
                    settings.clearSuggestions(guild_id);
                    settings.setMessageId(guild_id, null);
                    settings.clearVotes(guild_id);
                    settings.clearUserVotes(guild_id);
                }
            }
        } else {
            settings.addGuild(guild_id);
        }
    });
    Logger.info('Finished loading settings');
};

settings.save = () => {
    removeGuilds.forEach(guild_id => delete Settings[guild_id]);
    Object.keys(Settings).forEach(value => {
        const guild = Settings[value];
        guild.suggest_system.votes = mapToJson(guild.suggest_system.votes);
        guild.suggest_system.user_votes = mapToJson(guild.suggest_system.user_votes);
    });
    Logger.info('Saving settings...');
    fs.writeFileSync('./settings/settings.json', JSON.stringify(Settings, null, 4));
    Logger.info('Finished saving settings');
};

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
            name: '-',
            time: "-",
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

settings.addSuggestion = (guild_id, date, time, activity, username) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.suggest_system.suggestions.push({
            date: `${moment(`${date} ${time} PM`, 'M/D h:mm A').format('M/D h:mm A')}`,
            name: activity,
            author: username
        });
    }
    return false;
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
        votes.set(emote, votes.get(emote) - 1);
        return true;
    }
    return false;
};

settings.hasVote = (guild_id, emote) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        return guild.suggest_system.votes.has(emote);
    }
    return false;
};

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
        guild.suggest_system.user_votes.delete(user_id);
        return true;
    }
    return false;
};

settings.hasUserVote = (guild_id, user_id) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        return guild.suggest_system.user_votes.has(user_id);
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

settings.setActivityTime = (guild_id, time) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.activity.time = time;
        return true;
    }
    return false;
};

settings.getActivityParticipants = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.activity.participants.slice() : null;
};

settings.addParticipant = (guild_id, name) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.activity.participants.push(name);
        return true;
    }
    return false;
};

settings.removeParticipant = (guild_id, name) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.activity.participants = guild.activity.participants.filter(val => val !== name);
        return true;
    }
    return false;
};

settings.hasParticipant = (guild_id, name) => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        return guild.activity.participants.includes(name);
    }
    return false;
};

settings.clearParticipants = guild_id => {
    const guild = settings.getGuild(guild_id);
    if (guild) {
        guild.activity.participants = [];
        return true;
    }
    return false;
};

module.exports = settings;