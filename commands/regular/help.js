'use strict';

const Discord = require('discord.js');
const Settings = require('../../settings/settings');

module.exports = {
    name: 'help',
    desc: 'Shows available commmands.',
    usage: 'help',
    validate(msg, obj) {
        return true;
    },
    execute({ channel, guild }, obj) {
        helpEmbed
            .setColor(`#${getHex()}`)
            .setTitle(`Commands | Prefix: ${Settings.getPrefix(guild.id)}`);
        channel.send(helpEmbed);
    }
};

const getHex = () => {
    let hex = (Math.random() * 16777216).toString(16).replace(/(\.[\d\w]+)?$/, '');
    while (hex.length < 6)
        hex = '0' + hex;
    return hex;
};

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/regular').filter(file => file.endsWith('.js'));
let description = '';
for (const file of commandFiles) {
    const command = require(`./${file}`);
    if (command.name)
        description += `\`${command.usage}\` ${command.desc}\n`;
}
const helpEmbed = new Discord.RichEmbed()
    .setDescription(description);