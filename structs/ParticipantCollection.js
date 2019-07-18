'use strict';

class PartipantCollection {
    /**
     * 
     * @param {string[]} data 
     */
    constructor(data = []) {
        this.participants = data;
    }

    array() {
        return this.participants.slice();
    }

    /**
     * 
     * @param {string} name 
     */
    add(name) {
        this.participants.push(name);
    }

    /**
     * 
     * @param {string} name 
     */
    remove(name) {
        const index = this.participants.indexOf(name);
        this.participants.splice(index, 1);
    }

    /**
     * 
     * @param {string} name 
     */
    has(name) {
        return this.participants.includes(name);
    }

    clear() {
        this.participants = [];
    }

    getElement() {
        return this.participants.slice();
    }
}

module.exports = PartipantCollection;