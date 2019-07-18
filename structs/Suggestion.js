'use strict';

class Suggestion {
    /**
     * 
     * @param {string} time 
     * @param {string} name 
     * @param {string} author 
     */
    constructor(time, name, author) {
        this.time = time;
        this.name = name;
        this.author = author;
    }

    /**
     * 
     * @param {object} data 
     * @param {string} data.time 
     * @param {string} data.name 
     * @param {string} data.author
     */
    set(data) {
        if (data.time)
            this.time = data.time;
        if (data.name)
            this.name = data.name;
        if (data.author)
            this.author = data.author;
    }

    getElement() {
        return {
            time: this.time,
            name: this.name,
            author: this.author
        };
    }
}

module.exports = Suggestion;