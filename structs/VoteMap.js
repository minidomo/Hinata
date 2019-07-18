'use strict';

const Transform = require('../util/transform');

/**
 * @extends {Map<string, number>}
 */
class VoteMap extends Map {
    /**
     * 
     * @param {string} data 
     */
    constructor(data) {
        data ? super(Transform.jsonToMap(data)) : super();
    }

    /**
     * 
     * @param {string} emote 
     */
    increase(emote) {
        if (!this.has(emote))
            this.set(emote, 0);
        return this.set(emote, this.get(emote) + 1);
    }

    /**
     * 
     * @param {string} emote 
     */
    decrease(emote) {
        return this.set(emote, this.get(emote) - 1);
    }

    getElement() {
        return Transform.mapToJson(this);
    }
}

module.exports = VoteMap;