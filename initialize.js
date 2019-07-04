'use strict';

const Discord = require('discord.js');

let initialized = fales;

/**
 * @param {Discord.Client} client
 */
module.exports = client => {
    if (initialized)
        return;
    initialized = true;
    count++;
    client.user.setActivity('Volleyball!');

};