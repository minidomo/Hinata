'use strict';

const Discord = require('discord.js');
const Settings = require('../settings/settings');
const Topic = require('./topic');


/**
 * @param {Discord.Message} msg
 */
module.exports = msg => {
    const guild_id = msg.guild.id;
    Settings.setChannelId(guild_id, msg.channel.id);
    Settings.setChannelName(guild_id, msg.channel.name);
    Settings.setMessageId(guild_id, null);
    Settings.clearVotes(guild_id);
    Settings.clearUserVotes(guild_id);
    Settings.clearSuggestions(guild_id);
    Topic(guild_id);
};