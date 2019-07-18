'use strict';

const Transform = require('../util/transform');

/**
 * @extends {Map<string, string>}
 */
class UserMap extends Map {
    /**
     * 
     * @param {string} data 
     */
    constructor(data) {
        data ? super(Transform.jsonToMap(data)) : super();
    }

    /**
     * 
     * @param {string} user_id 
     */
    has(user_id) {
        return super.has(user_id);
    }

    /**
     * 
     * @param {string} user_id 
     */
    get(user_id) {
        return super.get(user_id);
    }

    /**
     * @param {string} user_id
     * @param {string} emote
     */
    set(user_id, emote) {
        return super.set(user_id, emote);
    }

    /**
     * 
     * @param {string} user_id 
     */
    delete(user_id) {
        return super.delete(user_id);
    }

    getElement() {
        return Transform.mapToJson(this);
    }
}

module.exports = UserMap;