'use strict';

module.exports = {
    generate() {
        let hex = (Math.random() * 0xFFFFFF).toString(16).replace(/(\.[\d\w]+)?$/, '');
        while (hex.length < 6)
            hex = '0' + hex;
        return hex;
    }
};