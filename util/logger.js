'use strict';

const moment = require('moment');
const timestamp = () => `[${moment().format('hh:mm:ss A')}]`;

const Logger = {};

Logger.log = args => {
    console.log(`${timestamp()} ${args}`);
};

Logger.objectLog = args => {
    console.log(timestamp());
    console.log(args);
};

Logger.error = args => {
    console.error(`${timestamp()} ${args}`)
};

Logger.realError = args => {
    console.log(timestamp());
    console.error(args);
};

module.exports = Logger;