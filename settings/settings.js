'use strict';

const Discord = require('discord.js');
const Settings = require('./settings.json');

const settings = {};

/**
 * @type {Discord.Client}
 */
let client;

settings.load = () => {

};

settings.save = () => {

};

settings.setClient = cl => {
    if (client)
        return;
    client = cl;
};

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

settings.getName = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.name : null;
};

settings.setName = (guild_id, name) => {
    const guild = settings.getGuild(guild_id);
    guild.name = name;
};

settings.getPrefix = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.prefix : null;
};

settings.setPrefix = (guild_id, prefix) => {
    const guild = settings.getGuild(guild_id);
    guild.prefix = prefix;
};

settings.getChannelId = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.channel.id : null;
};

settings.setChannelId = (guild_id, channel_id) => {
    const guild = settings.getGuild(guild_id);
    guild.channel.id = channel_id;
};

settings.getChannelName = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.channel.name : null;
};

settings.setChannelName = (guild_id, channel_name) => {
    const guild = settings.getGuild(guild_id);
    guild.channel.name = channel_name;
};

settings.getSuggestMinimum = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.suggest_system.minimum : null;
};

settings.setSuggestMinimum = (guild_id, min) => {
    const guild = settings.getGuild(guild_id);
    guild.suggest_system.minimum = min;
};

settings.getSuggestSuggestion = guild_id => {
    // no setter or adder
    const guild = settings.getGuild(guild_id);
    return guild ? guild.suggest_system.suggestions : null;
};

settings.getMessageId = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.suggest_system.message_id : null;
};

settings.setMessageId = (guild_id, message_id) => {
    const guild = settings.getGuild(guild_id);
    guild.suggest_system.message_id = message_id;
};

settings.getVotes = guild_id => {
    // no setter or adder
    const guild = settings.getGuild(guild_id);
    return guild ? guild.suggest_system.votes : null;
};

settings.getUserVotes = guild_id => {
    // no setter or adder
    const guild = settings.getGuild(guild_id);
    return guild ? guild.suggest_system.user_votes : null;
};

settings.getActivityName = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.activity.name : null;
};

settings.setActivityName = (guild_id, name) => {
    const guild = settings.getGuild(guild_id);
    guild.activity.name = name;
};

settings.getActivityTime = guild_id => {
    const guild = settings.getGuild(guild_id);
    return guild ? guild.activity.time : null;
};

settings.setActivityName = (guild_id, time) => {
    const guild = settings.getGuild(guild_id);
    guild.activity.time = time;
};

settings.getActivityParticipants = guild_id => {
    // no setter or adder
    const guild = settings.getGuild(guild_id);
    return guild ? guild.activity.participants : null;
};

module.exports = settings;