'use strict';

const Discord = require('discord.js');
const Logger = require('./util/logger');
const Settings = require('./settings/settings');

let initialized = false;

/**
 * @param {Discord.Client} client
 */
module.exports = client => {
    if (initialized)
        return;
    initialized = true;
    client.user.setActivity('Volleyball!');
    require('./util/commands');
    Settings.setClient(client);
    Settings.load();
};