'use strict';

const Suggestion = require('./Suggestion');
const StringFormat = require('../util/stringformat');
const moment = require('moment');

class SuggestCollection {
    /**
     * 
     * @param {Suggestion[]} data 
     */
    constructor(data = []) {
        this.suggestions = data.map(val => new Suggestion(val.time, val.name, val.author));
    }

    array() {
        return this.suggestions.slice();
    }

    size() {
        return this.suggestions.length;
    }

    /**
     * 
     * @param {string} date
     * @param {string} time
     * @param {string} name
     * @param {string} author 
     */
    add(date, time, name, author) {
        const timeformat = `${moment(`${date} ${time} PM`, 'M/D h:mm A').format('M/D h:mm A')}`;
        this.suggestions.push(new Suggestion(timeformat, StringFormat.capitalize(name), author));
    }

    clear() {
        this.suggestions = [];
    }

    getElement() {
        return this.suggestions.map(val => val.getElement());
    }
}

module.exports = SuggestCollection;