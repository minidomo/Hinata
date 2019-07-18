'use strict';

const Discord = require('discord.js');
const { Settings } = require('../settings/settings');
const Topic = require('./topic').update;


/**
 * @param {Discord.Message} msg
 */
module.exports = msg => {
    const guild_id = msg.guild.id;
    const guildSettings = Settings.get(guild_id);
    guildSettings.channel.set({ id: msg.channel.id, name: msg.channel.name });
    guildSettings.suggest_system.clear();
    Topic(guild_id);
};