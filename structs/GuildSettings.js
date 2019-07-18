'use strict';

const ChannelInfo = require('./ChannelInfo');
const SuggestSystem = require('./SuggestSystem');
const Activity = require('./Activity');

/**
 * @class
 */
class GuildSettings {
    /**
     * 
     * @param {object} data
     * @param {string} data.name
     * @param {string} data.prefix
     * @param {object} data.channel
     * @param {object} data.suggest_system
     * @param {object} data.activity
     */
    constructor(data = {}) {
        this.name = data.name || null;
        this.prefix = data.prefix || GuildSettings.DEFAULT_PREFIX();
        this.channel = new ChannelInfo(data.channel);
        this.suggest_system = new SuggestSystem(data.suggest_system);
        this.activity = new Activity(data.activity);
    }

    /**
     * 
     * @param {object} data
     * @param {string} data.name
     * @param {string} data.prefix
     */
    set(data) {
        if (data.name)
            this.name = data.name;
        if (data.prefix)
            this.prefix = data.prefix;
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

    /**
     * 
     * @param {string} prefix 
     */
    setPrefix(prefix) {
        this.prefix = prefix;
    }

    getPrefix() {
        return this.prefix;
    }

    getChannel() {
        return this.channel;
    }

    getSuggestSystem() {
        return this.suggest_system;
    }

    getActivity() {
        return this.activity;
    }

    getElement() {
        return {
            name: this.name,
            prefix: this.prefix,
            channel: this.channel.getElement(),
            suggest_system: this.suggest_system.getElement(),
            activity: this.activity.getElement()
        };
    }

    static DEFAULT_PREFIX() {
        return '!!';
    }
}

module.exports = GuildSettings;