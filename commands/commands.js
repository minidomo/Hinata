'use strict';

const Logger = require('../util/logger');

const commands = {
    regular: new Map(),
    admin: new Map()
};

Logger.info('Loading commands...');

const fs = require('fs');
let directories = fs.readdirSync('./commands').filter(directory => !directory.endsWith('.js'));
for (const directory of directories) {
    const commandFiles = fs.readdirSync(`./commands/${directory}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${directory}/${file}`);
        if (directory === 'regular')
            commands.regular.set(command.name, command);
        else
            commands.admin.set(command.name, command);
    }
}

module.exports = commands;