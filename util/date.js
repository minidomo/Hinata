'use strict';

const moment = require('moment');

const currentYear = moment().year();
const regexDate = /^\d{1,2}\/\d{1,2}$/;
const regexTime = /^\d{1,2}:\d{1,2}$/;

module.exports = {
    isValidDate(date) {
        return regexDate.test(date);
    },
    isValidTime(time) {
        return regexTime.test(time);
    },
    isValid(date, time) {
        const res = this.getMoment(date, time);
        return res.isValid();
    },
    isInPast(date, time) {
        const now = moment();
        const res = this.getMoment(date, time);
        return res.isSameOrBefore(now, 'minute');
    },
    getMoment(date, time) {
        return moment(`${currentYear}/${date} ${time} PM`, "YYYY/M/D h:mm A");
    },
    checkDate(msg, date, time) {
        if (!this.isValidDate(date)) {
            msg.channel.send('`<date>` must be in M/D format.')
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (!this.isValidTime(time)) {
            msg.channel.send('`<time>` must be in H/MM format. It is assumed that the time will be PM.')
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (!this.isValid(date, time)) {
            msg.channel.send('Invalid date or time.')
                .then(feedback => feedback.delete(2000));
            return false;
        }
        if (this.isInPast(date, time)) {
            msg.channel.send('The given `<date>` and `<time>` cannot be in the past.')
                .then(feedback => feedback.delete(2000));
            return false;
        }
        return true;
    }
};