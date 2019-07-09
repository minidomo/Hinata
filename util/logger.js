'use strict';

const moment = require('moment');
const winston = require('winston');

const timestamp = () => `${moment().format('hh:mm:ss A')}`;

const Logger = winston.createLogger({
    exitOnError: false,
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.printf(log => `[${log.level.toUpperCase()} | ${timestamp()}] - ${log.message}`)
});

module.exports = Logger;