'use strict';

class ChannelInfo {
    /**
     * 
     * @param {object} data 
     * @param {string} data.id
     * @param {string} data.name
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || null;
    }

    /**
     * 
     * @param {object} data 
     * @param {string} data.id
     * @param {string} data.name
     */
    set(data) {
        if (data.id)
            this.id = data.id;
        if (data.name)
            this.name = data.name;
    }

    /**
     * 
     * @param {string} id 
     */
    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    /**
     * 
     * @param {string} name 
     */
    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    clear() {
        this.id = null;
        this.name = null;
    }

    getElement() {
        return {
            id: this.id,
            name: this.name
        }
    }
}

module.exports = ChannelInfo;