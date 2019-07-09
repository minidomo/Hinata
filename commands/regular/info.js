'use strict';

const Discord = require('discord.js');
const Hex = require('../../util/hex');

const description = `This bot was made by JB Ladera and coded in JavaScript using the [Node.js runtime](https://nodejs.org/en/) and [discord.js library](https://discord.js.org/#/).\n`
    + `• The default prefix is \`/\` but can be changed via \`/setprefix\`.\n`
    + `• Use \`/help\` to view regular commands and \`/helpadmin\` (admin only) to view admin commands.\n`
    + `• Use \`/setup\` in a text channel to set up a channel.\n`
    + `[Source code](https://github.com/MiniDomo/Volleyball) • [Invite](https://discordapp.com/oauth2/authorize?client_id=587004440666570761&scope=bot&permissions=388176)`;

const embed = new Discord.RichEmbed()
    .setTitle('About Me')
    .setAuthor('JB Ladera')
    .setThumbnail('https://avatars2.githubusercontent.com/u/32505118?s=460&v=4')
    .setDescription(description);

module.exports = {
    name: 'info',
    desc: 'Shows information about this bot.',
    usage: 'info',
    validate(msg, obj) {
        return true;
    },
    execute(msg, obj) {
        embed.setColor(`#${Hex.generate()}`);
        msg.channel.send(embed);
    }
};