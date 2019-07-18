'use strict';

const Discord = require('discord.js');
const { Settings } = require('../../settings/settings');
const Hex = require('../../util/hex');

module.exports = {
    name: 'help',
    desc: 'Shows available commmands.',
    usage: 'help',
    validate(msg, obj) {
        return true;
    },
    execute({ channel, guild }, obj) {
        helpEmbed
            .setColor(`#${Hex.generate()}`)
            .setTitle(`Commands | Prefix: ${Settings.get(guild.id).prefix}`);
        channel.send(helpEmbed);
    }
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