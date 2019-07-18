'use strict';

const SuggestCollection = require('./SuggestCollection');
const Suggestion = require('./Suggestion');
const VoteMap = require('./VoteMap');
const UserMap = require('./UserMap');

class SuggestSystem {
    /**
     * 
     * @param {object} data 
     * @param {number} data.minimum
     * @param {string} data.message_id
     * @param {Suggestion[]} data.suggestions
     * @param {string} data.votes
     * @param {string} data.users
     */
    constructor(data = {}) {
        this.minimum = data.minimum || SuggestSystem.DEFAULT_MINIMUM();
        this.message_id = data.message_id || null;
        this.suggestions = new SuggestCollection(data.suggestions);
        this.votes = new VoteMap(data.votes);
        this.users = new UserMap(data.users);
    }

    /**
     * 
     * @param {object} data 
     * @param {number} data.minimum
     * @param {string} data.message_id
     */
    set(data) {
        if (data.minimum)
            this.minimum = data.minimum;
        if (data.message_id)
            this.message_id = data.message_id;
    }

    /**
     * 
     * @param {number} minimum 
     */
    setMinimum(minimum) {
        this.minimum = minimum;
    }

    getMinimum() {
        return this.minimum;
    }

    /**
     * 
     * @param {string} id 
     */
    setMessageId(id) {
        this.message_id = id;
    }

    getMessageId() {
        return this.message_id;
    }

    getSuggestions() {
        return this.suggestions;
    }

    getVotes() {
        return this.votes;
    }

    getUsers() {
        return this.users;
    }

    clear() {
        this.message_id = null;
        this.suggestions.clear();
        this.votes.clear();
        this.users.clear();
    }

    getElement() {
        return {
            minimum: this.minimum,
            message_id: this.message_id,
            suggestions: this.suggestions.getElement(),
            votes: this.votes.getElement(),
            users: this.users.getElement()
        };
    }

    static DEFAULT_MINIMUM() {
        return 2;
    }
}

module.exports = SuggestSystem;