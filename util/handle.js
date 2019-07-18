'use strict';

const { Settings } = require('../settings/settings');
const Discord = require('discord.js');
const { regular, admin } = require('../commands/commands');

module.exports = {
    getArgs(msg) {
        const { content, guild } = msg;
        const prefix = Settings.get(guild.id).getPrefix();
        if (content.startsWith(prefix)) {
            const match = /^([^\w\d\s]+)/.exec(content);
            if (match[1] === prefix) {
                let arr;
                if (typeof content === 'string') {
                    arr = content.substr(prefix.length).split(/\s+/g);
                } else {
                    arr = content.slice();
                }
                msg.delete(2000);
                return {
                    base: arr.shift().toLowerCase(),
                    args: arr
                };
            }
        }
        return undefined;
    },
    handle(msg, obj) {
        const reg = regular.has(obj.base),
            ad = admin.has(obj.base),
            perm = msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
        if (reg && ad && perm) {
            let command = admin.get(obj.base);
            if (command.validate(msg, obj)) {
                command.execute(msg, obj);
                return true;
            }
            command = regular.get(obj.base);
            if (command.validate(msg, obj)) {
                command.execute(msg, obj);
                return true;
            }
        } else if (ad && perm) {
            const command = admin.get(obj.base);
            if (command.validate(msg, obj)) {
                command.execute(msg, obj);
                return true;
            }
        } else if (reg) {
            const command = regular.get(obj.base);
            if (command.validate(msg, obj)) {
                command.execute(msg, obj);
                return true;
            }
        } else {
            msg.channel.send(`Command not found.`)
                .then(feedback => feedback.delete(2000));
        }
        return false;
    }
};  