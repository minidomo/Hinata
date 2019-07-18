'use strict';

module.exports = {
    /**
     * @param {string} jsonStr
     */
    jsonToMap(jsonStr) { return new Map(JSON.parse(jsonStr)) },
    /**
     * @param {Map} map
     */
    mapToJson(map) { return map.size > 0 ? JSON.stringify([...map]) : "[]" }
};