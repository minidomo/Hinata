'use strict';

const StringFormat = require('../util/stringformat');
const ParticipantCollection = require('./ParticipantCollection');

class Activity {
    /**
     * 
     * @param {object} data 
     * @param {string} data.time
     * @param {string} data.name
     * @param {string[]} participants
     */
    constructor(data = {}) {
        this.time = data.time || Activity.DEFAULT_EMPTY();
        this.name = data.name || Activity.DEFAULT_EMPTY();
        this.participants = new ParticipantCollection(data.participants);
    }

    /**
     * 
     * @param {object} data 
     * @param {string} data.time
     * @param {string} data.name
     */
    set(data) {
        if (data.time)
            this.time = data.time;
        if (data.name)
            this.name = data.name;
    }

    /**
     * 
     * @param {string} time 
     */
    setTime(time) {
        this.time = time;
    }

    getTime() {
        return this.time;
    }

    /**
     * 
     * @param {string} name 
     */
    setName(name) {
        this.name = StringFormat.capitalize(name);
    }

    getName() {
        return this.name;
    }

    getParticipants() {
        return this.participants;
    }

    clear() {
        this.time = Activity.DEFAULT_EMPTY();
        this.name = Activity.DEFAULT_EMPTY();
        this.participants.clear();
    }

    getElement() {
        return {
            time: this.time,
            name: this.name,
            participants: this.participants.getElement()
        };
    }

    static DEFAULT_EMPTY() {
        return '-';
    }
}

module.exports = Activity;