'use strict';

var async = require('async');
var config = require('./configs/config');
var logger = require('./modules/logger');
var jenkinsGrabber = require('./modules/jenkinsGrabber')(config.jenkins);
var rpiLightManipulator = require('./modules/rpiLightManipulator')(config.rpi);

logger.info('Start...');

jenkinsGrabber.setLogger(logger);
rpiLightManipulator.setLogger(logger);

var updateState = function () {
    async.waterfall([
        function (next) {
            jenkinsGrabber.getStatus(next);
        },
        function (status, next) {
            if (status === jenkinsGrabber.STATUS.OK) {
                rpiLightManipulator.turnOn(rpiLightManipulator.COLORS.GREEN, next);
            } else if (status === jenkinsGrabber.STATUS.FAIL) {
                rpiLightManipulator.turnOn(rpiLightManipulator.COLORS.RED, next);
            } else if (status === jenkinsGrabber.STATUS.RUN) {
                rpiLightManipulator.turnOnBlinked(rpiLightManipulator.COLORS.YELLOW, next);
            } else {
                rpiLightManipulator.turnOffAll(next);
            }
        }
    ], function (err) {
        if (err) {
            logger.error(err);
        }
    });
};

// handle errors
async.waterfall([
    function (next) {
        rpiLightManipulator.setup(function () {
            next();
        });
    },
    function (next) {
        rpiLightManipulator.turnOffAll(function () {
            next();
        });
    }
], function (err) {
    if (err) {
        logger.error(err);
    }

    updateState();

    setInterval(function () {
        updateState();
    }, config.interval);
});
