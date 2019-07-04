'use strict';

const Discord = require('discord.js');
const Settings = require('./settings.json');

const settings = {};

/**
 * @type {Discord.Client}
 */
let client;

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
            id: "",
            name: ""
        },
        suggest_system: {
            minimum: 4,
            suggestions: [],
            message_id: "",
            votes: new Map(),
            user_votes: new Map()
        },
        activity: {
            name: "",
            time: "None Set",
            participants: []
        }
    };
    return true;
};

module.exports = settings;