'use strict';

var async = require('async');
var gpio = require('rpi-gpio');

module.exports = function (_config) {
    _config = (_config || {});

    var COLORS = {
        RED: 'red',
        YELLOW: 'yellow',
        GREEN: 'green'
    };

    var _COLORS_ARRAY = ['red', 'yellow', 'green'];
    var _BLINK_INTERVAL = 1 * 1000;
    var _lastState = {
        red: null,
        yellow: null,
        green: null
    };
    var _blinkedIntervals = {
        red: null,
        yellow: null,
        green: null
    };

    var _logger = (_config.logger ? _config.logger : {
        debug: function () {
            // empty
        }
    });

    if (!_config.gpio || !_config.gpio.color) {
        throw new Error('[rpiLightManipulator] gpio configuration missed (config.gpio.color).');
    } else if (!_config.gpio || !_config.gpio.outputLevel) {
        throw new Error('[rpiLightManipulator] gpio configuration missed (config.gpio.outputLevel).');
    } else {
        for (var i = 0; i < _COLORS_ARRAY.length; i++) {
            if (!_config.gpio.color[_COLORS_ARRAY[i]]) {
                throw new Error(
                    '[rpiLightManipulator] gpio pin configuration missed (config.gpio.color' + _COLORS_ARRAY[i] + ').'
                );
            }
        }
    }

    /**
     * @param {Function} logger
     */
    var setLogger = function (logger) {
        _logger = logger;
    };

    /**
     * @param {Function} callback
     */
    var setup = function (callback) {
        async.map(_COLORS_ARRAY, function (color, next) {
            clearInterval(_blinkedIntervals[color]);
            _blinkedIntervals[color] = null;
            _lastState[color] = _config.gpio.outputLevel.off;
            gpio.setup(_config.gpio.color[color], gpio.DIR_OUT, next);
        }, callback);
    };

    /**
     * @param {String|Array} arr      color array ['red', 'green'] of string 'red'
     * @param {Function}     callback
     */
    var turnOff = function (arr, callback) {
        if (!Array.isArray(arr)) {
            arr = [arr];
        }

        async.map(arr, function (color, next) {
            clearInterval(_blinkedIntervals[color]);
            _blinkedIntervals[color] = null;
            _lastState[color] = _config.gpio.outputLevel.off;
            gpio.write(_config.gpio.color[color], _config.gpio.outputLevel.off, next);
        }, callback);
    };

    /**
     * @param {Function} callback
     */
    var turnOffAll = function (callback) {
        turnOff(_COLORS_ARRAY, callback);
    };

    /**
     * @param {String}   color
     * @param {Function} callback
     */
    var turnOn = function (color, callback) {
        _logger.debug('[rpiLightManupulator] turn on:', color);

        if (_COLORS_ARRAY.indexOf(color) === -1) {
            throw new Error('[rpiLightManupulator] color "' + color + '" is not supported');
        }

        turnOff(
            _COLORS_ARRAY.filter(function (item) {
                return (item !== color);
            }),
            function () {
                clearInterval(_blinkedIntervals[color]);
                _blinkedIntervals[color] = null;
                _lastState[color] = _config.gpio.outputLevel.on;
                gpio.write(_config.gpio.color[color], _config.gpio.outputLevel.on, callback);
            }
        );
    };

    /**
     * @param {String}   color
     * @param {Function} callback
     */
    var turnOnBlinked = function (color, callback) {
        if (!_blinkedIntervals[color]) {
            turnOff(
                _COLORS_ARRAY.filter(function (item) {
                    return (item !== color);
                }),
                function () {
                    _blinkedIntervals[color] = setInterval(function () {
                        _lastState[color] = (
                            _lastState[color] === _config.gpio.outputLevel.off
                                ? _config.gpio.outputLevel.on
                                : _config.gpio.outputLevel.off
                        );
                        _logger.debug('[rpiLightManupulator] set blink state:', color, ':', _lastState[color]);
                        gpio.write(_config.gpio.color[color], _lastState[color]);
                    }, _BLINK_INTERVAL);
                }
            );
        }

        callback(null);
    };

    return {
        COLORS: COLORS,
        setLogger: setLogger,
        setup: setup,
        turnOff: turnOff,
        turnOffAll: turnOffAll,
        turnOn: turnOn,
        turnOnBlinked: turnOnBlinked
    };
};
