'use strict';

const Discord = require('discord.js');
const client = require('../other/client');
const { Settings } = require('../settings/settings');
const Emotes = require('../other/emotes');
const moment = require('moment');
const Topic = require('./topic').update;
const Hex = require('../util/hex');
const poll = {};

/**
 * @returns {Promise<string>}
 */
poll.create = async guild_id => {
    try {
        const guildSettings = Settings.get(guild_id);
        const channel_id = guildSettings.channel.id;
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
        guildSettings.suggest_system.message_id = message.id;
        return guild_id;
    } catch (err) {
        throw err;
    }
};

/**
 * @param {string} guild_id
 * @param {number|undefined} position
 */
poll.update = async (guild_id, position = undefined) => {
    try {
        const guildSettings = Settings.get(guild_id);
        const channel_id = guildSettings.channel.id;
        /**
         * @type {Discord.TextChannel}
         */
        const channel = client.guilds.get(guild_id).channels.get(channel_id);
        const message = await channel.fetchMessage(guildSettings.suggest_system.message_id);
        const embed = new Discord.RichEmbed()
            .setColor(`#${Hex.generate()}`)
            .setTitle('Activity Poll')
            .setDescription(description(guild_id))
            .setTimestamp();
        const suggestions = guildSettings.suggest_system.suggestions.array();
        const emotes = getValidEmotes(guild_id);
        for (let x = 0; x < suggestions.length; x++) {
            const { author, time, name } = suggestions[x];
            const formattedDate = moment(time, 'M/D h:mm A').format('dddd MMMM D, h:mm A');
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
        const guildSettings = Settings.get(guild_id);
        const suggest_system = guildSettings.suggest_system;
        const { name, time } = suggest_system.suggestions.array()[position];
        guildSettings.activity.set({ time: time, name: name });
        suggest_system.clear();
        await Topic(guild_id);
        return guild_id;
    } catch (err) {
        throw err;
    }
};

poll.forceEnd = async guild_id => {
    try {
        const guildSettings = Settings.get(guild_id);
        await poll.update(guild_id, -1);
        guildSettings.suggest_system.clear();
        await Topic(guild_id);
        return guild_id;
    } catch (err) {
        throw err;
    }
};

poll.exists = guild_id => {
    if (Settings.get(guild_id).suggest_system.message_id)
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
    const guildSettings = Settings.get(guild_id);
    const suggest_system = guildSettings.suggest_system;
    if (guildSettings.channel.id !== message.channel.id || message.id !== suggest_system.message_id)
        return false;
    const emote = reaction.emoji.name;
    if (!isValidEmote(guild_id, emote)) {
        reaction.remove(user);
        return false;
    }
    if (adding) {
        if (suggest_system.users.has(user.id)) {
            const oldEmote = suggest_system.users.get(user.id);
            message.reactions.get(oldEmote).remove(user);
        }
        suggest_system.votes.increase(emote);
        suggest_system.users.set(user.id, emote);
        const count = suggest_system.votes.get(emote);
        if (count === suggest_system.minimum) {
            poll.end(guild_id, emote);
        }
    } else {
        suggest_system.votes.decrease(emote);
        if (suggest_system.users.get(user.id) === emote)
            suggest_system.users.delete(user.id);
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
    const suggestions = Settings.get(guild_id).suggest_system.suggestions.array();
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
    const guildSettings = Settings.get(guild_id);
    const prefix = guildSettings.prefix;
    let desc = `Vote for a time to play an activity by reacting with the corresponding emojis below. `
        + `The poll can take up to 10 suggestions at a time, and once that limit has been reached, no suggestions will be be taken until the poll ends. `
        + `The poll ends when one suggestion reaches ${guildSettings.suggest_system.minimum} vote(s) (excluding the bot's vote) or when \`${prefix}endpoll\` is used (admin only). `
        + `Use \`${prefix}suggest\` to suggest a date and time to do an activity.`
    return desc;
};

module.exports = poll;