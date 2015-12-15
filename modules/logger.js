'use strict';

var Winston = require('winston');

var logger = new Winston.Logger({
    transports: [
        new Winston.transports.Console({
            level: 'debug',
            colorize: true,
            timestamp: true,
            handleExceptions: false
        })
    ],
    exitOnError: false
});

logger.cli();

module.exports = logger;
