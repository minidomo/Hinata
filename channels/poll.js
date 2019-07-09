'use strict';

const Discord = require('discord.js');
const client = require('../other/client');
const Settings = require('../settings/settings');
const Emotes = require('../other/emotes');
const moment = require('moment');
const Topic = require('./topic').update;
const Logger = require('../util/logger');
const Hex = require('../util/hex');
const poll = {};

/**
 * @returns {Promise<string>}
 */
poll.create = async guild_id => {
    try {
        const channel_id = Settings.getChannelId(guild_id);
        /**
         * @type {Discord.TextChannel}
         */
        const channel = client.guilds.get(guild_id).channels.get(channel_id);
        const embed = new Discord.RichEmbed()
            .setColor(`#${Hex.generate()}`)
            .setTitle('Activity Poll')
            .setDescription(description(guild_id))
            .setTimestamp();
        const message = await channel.send(embed);
        Settings.setMessageId(guild_id, message.id);
        return guild_id;
    } catch (err) {
        Logger.error(err);
        throw err;
    }
};

/**
 * @param {string} guild_id
 * @param {number|undefined} position
 */
poll.update = async (guild_id, position = undefined) => {
    try {
        const channel_id = Settings.getChannelId(guild_id);
        /**
         * @type {Discord.TextChannel}
         */
        const channel = client.guilds.get(guild_id).channels.get(channel_id);
        const message = await channel.fetchMessage(Settings.getMessageId(guild_id));
        const embed = new Discord.RichEmbed()
            .setColor(`#${Hex.generate()}`)
            .setTitle('Activity Poll')
            .setDescription(description(guild_id))
            .setTimestamp();
        const suggestions = Settings.getSuggestions(guild_id);
        const emotes = getValidEmotes(guild_id);
        for (let x = 0; x < suggestions.length; x++) {
            const { author, date, name } = suggestions[x];
            const formattedDate = moment(date, 'M/D h:mm A').format('dddd MMMM D, h:mm A');
            const selection = typeof position === 'number';
            const emote = selection ? Emotes[position === x ? 'check' : 'crossmark'] : emotes[x];
            const fieldName = `${emote} ${name} - ${formattedDate} - ${author}`;
            embed.addField(fieldName, 'ᅠ'); // invisible character 'hangul jungseong filler' unicode character
            if (!message.reactions.has(emotes[x]))
                await message.react(emotes[x]);
        }
        await message.edit(embed);
        return guild_id;
    } catch (err) {
        throw err;
    }
};

poll.end = async (guild_id, emote) => {
    try {
        const position = getEmotePosition(guild_id, emote);
        await poll.update(guild_id, position);
        Settings.setMessageId(guild_id, null);
        Settings.clearVotes(guild_id);
        Settings.clearUserVotes(guild_id);
        const { name, date } = Settings.getSuggestions(guild_id)[position];
        Settings.setActivityName(guild_id, name);
        Settings.setActivityTime(guild_id, date);
        Settings.clearSuggestions(guild_id);
        await Topic(guild_id);
        return guild_id;
    } catch (err) {
        throw err;
    }
};

poll.forceEnd = async guild_id => {
    try {
        await poll.update(guild_id, -1);
        Settings.setMessageId(guild_id, null);
        Settings.clearVotes(guild_id);
        Settings.clearUserVotes(guild_id);
        Settings.clearSuggestions(guild_id);
        await Topic(guild_id);
        return guild_id;
    } catch (err) {
        throw err;
    }
};

poll.exists = guild_id => {
    if (Settings.getMessageId(guild_id))
        return true;
    return false;
};

/**
 * @param {Discord.MessageReaction} reaction
 * @param {Discord.User} user
 * @param {boolean} adding
 */
poll.handle = (reaction, user, adding) => {
    const { message } = reaction;
    const guild_id = message.guild.id;
    if (Settings.getChannelId(guild_id) !== message.channel.id || message.id !== Settings.getMessageId(guild_id))
        return false;
    const emote = reaction.emoji.name;
    if (!isValidEmote(guild_id, emote)) {
        reaction.remove(user);
        return false;
    }
    if (adding) {
        if (Settings.hasUserVote(guild_id, user.id)) {
            const oldEmote = Settings.getUserVotes(guild_id).get(user.id);
            message.reactions.get(oldEmote).remove(user);
        }
        Settings.addVote(guild_id, emote);
        Settings.addUserVote(guild_id, user.id, emote);
        const count = Settings.getVotes(guild_id).get(emote);
        if (count === Settings.getSuggestMinimum(guild_id)) {
            poll.end(guild_id, emote);
        }
    } else {
        Settings.removeVote(guild_id, emote);
        if (Settings.getUserVotes(guild_id).get(user.id) === emote)
            Settings.removeUserVote(guild_id, user.id);
    }
    return true;
};

const isValidEmote = (guild_id, emoji) => {
    const emotes = getValidEmotes(guild_id);
    return emotes.includes(emoji);
};

/**
 * @returns {string[]}
 */
const getValidEmotes = guild_id => {
    const suggestions = Settings.getSuggestions(guild_id);
    const emotes = Object.keys(Emotes).filter(key => {
        if (!/^\d+$/.test(key))
            return false;
        const num = parseInt(key);
        return num >= 1 && num <= suggestions.length;
    }).map(key => Emotes[key]);
    return emotes;
};

const getEmotePosition = (guild_id, emoji) => {
    const emotes = getValidEmotes(guild_id);
    return Math.max(0, emotes.indexOf(emoji));
};

const description = guild_id => {
    const prefix = Settings.getPrefix(guild_id);
    let desc = `Vote for a time to play an activity by reacting with the corresponding emojis below. `
        + `The poll can take up to 10 suggestions at a time, and once that limit has been reached, no suggestions will be be taken until the poll ends. `
        + `The poll ends when one suggestion reaches ${Settings.getSuggestMinimum(guild_id)} vote(s) (excluding the bot's vote) or when \`${prefix}endpoll\` is used (admin only). `
        + `Use \`${prefix}suggest\` to suggest a date and time to do an activity.`
    return desc;
};

module.exports = poll;