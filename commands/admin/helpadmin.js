'use strict';

const Discord = require('discord.js');
const Settings = require('../../settings/settings');
const Hex = require('../../util/hex');

module.exports = {
    name: 'helpadmin',
    desc: 'Shows available admin commmands.',
    usage: 'helpadmin',
    validate(msg, obj) {
        return true;
    },
    execute({ author, guild }, obj) {
        helpEmbed
            .setColor(`#${Hex.generate()}`)
            .setTitle(`Commands | Prefix: ${Settings.getPrefix(guild.id)}`);
        author.send(helpEmbed);
    }
};

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
let description = '';
for (const file of commandFiles) {
    const command = require(`./${file}`);
    if (command.name)
        description += `\`${command.usage}\` ${command.desc}\n`;
}
const helpEmbed = new Discord.RichEmbed()
    .setDescription(description);