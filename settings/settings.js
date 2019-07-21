'use strict';

const client = require('../other/client');

const Class = require('../structs/Class');
const Logger = require('../util/logger');
const Topic = require('../channels/topic').update;
const fs = require('fs');

const settingsjson = require('./settings.json') || {};
const settings = new Class.Settings();
const removeGuilds = new Set(Object.keys(settingsjson));

client.on('guildCreate', guild => {
    Logger.info(`Creating settings for ${guild.name} (${guild.id})`);
    settings.set(guild.id, new Class.GuildSettings({ name: guild.name }));
});

client.on('guildDelete', guild => {
    Logger.info(`Deleting settings for ${guild.name} (${guild.id})`);
    settings.delete(guild.id);
});

const Load = () => {
    Logger.info('Loading settings...');
    client.guilds.forEach(guild => {
        if (removeGuilds.has(guild.id)) {
            Logger.info(`Loading settings for ${guild.name} (${guild.id})`);
            removeGuilds.delete(guild.id);
            const guildSettings = new Class.GuildSettings(settingsjson[guild.id]);
            const channelInfo = guildSettings.channel;
            if (channelInfo.id) {
                let suggest_system = guildSettings.suggest_system;
                if (guild.channels.has(channelInfo.id)) {
                    if (suggest_system.message_id) {
                        const channel = guild.channels.get(channelInfo.id);
                        channel.fetchMessage(suggest_system.message_id)
                            .catch(() => {
                                suggest_system.clear();
                            });
                    }
                    settings.set(guild.id, guildSettings);
                    Topic(guild.id);
                } else {
                    channelInfo.clear();
                    suggest_system.clear();
                    settings.set(guild.id, guildSettings);
                }
            } else
                settings.set(guild.id, guildSettings);
        } else {
            Logger.info(`Creating settings for ${guild.name} (${guild.id})`);
            settings.set(guild.id, new Class.GuildSettings({ name: guild.name }));
        }
    });
    Logger.info('Finished loading settings');
};

const Save = () => {
    removeGuilds.forEach(guild_id => {
        Logger.info(`Deleting settings for ${settings.get(guild_id).name} (${guild_id})`);
        settings.delete(guild_id);
    });
    Logger.info('Saving settings...');
    fs.writeFileSync('./settings/settings.json', settings.toJson());
    Logger.info('Finished saving settings');
};

module.exports = { Settings: settings, Load, Save };