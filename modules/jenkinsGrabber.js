'use strict';

var http = require('http');

module.exports = function (_config) {
    _config = (_config || {});
    _config.host = (_config.host || 'localhost');
    _config.port = (_config.port || '80');

    if (!_config.view) {
        throw new Error('[jenkinsGrabber] Jenkins view config missed.');
    }

    var STATUS = {
        OK: 'ok',
        RUN: 'run',
        FAIL: 'fail',
        UNDEFINED: 'undefined'
    };

    var _logger = (_config.logger ? _config.logger : {
        info: function () {
            // empty
        }
    });

    /**
     * @param {String}   rawJson
     * @param {Function} callback
     * @private
     */
    var _parseStatus = function (rawJson, callback) {
        var json;
        var err = null;
        var value = STATUS.UNDEFINED;

        try {
            json = (JSON.parse(rawJson) || {});

            if (json.jobs) {
                for (var i = 0; i < json.jobs.length; i++) {
                    if ((json.jobs[i].color || '').substr(-6) === '_anime') {
                        value = STATUS.RUN;
                        break;
                    }

                    if (json.jobs[i].color === 'red') {
                        value = STATUS.FAIL;
                    } else if (json.jobs[i].color === 'blue' && value === STATUS.UNDEFINED) {
                        value = STATUS.OK;
                    }
                }
            } else {
                value = STATUS.UNDEFINED;
            }
        } catch (e) {
            err = '[jenkinsGrabber] bad json' + e;
            value = STATUS.UNDEFINED;
        }

        callback(err, value);
    };

    var _i = 0;
    /**
     * @param {Function} callback
     */
    var getStatus = function (callback) {
        _logger.info(
            '[jenkinsGrabber] request to:',
            (_config.host + ':' + _config.port + '/view/' + _config.view + '/api/json')
        );

        if (typeof callback !== 'function') {
            throw new Error('[jenkinsGrabber] callback parameter missed');
        }

        if (_config.demoMode) {
            _i++;
            var status = STATUS.UNDEFINED;
            if (_i === 1) {
                status = STATUS.OK;
            } else if (_i === 2) {
                status = STATUS.RUN;
            } else if (_i === 3) {
                status = STATUS.FAIL;
            } else {
                _i = 0;
            }

            callback(null, status);
        } else {
            http.get({
                    host: _config.host,
                    port: _config.port,
                    path: '/view/' + _config.view + '/api/json'
                }, function (res) {
                    var rawJson = '';
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                            rawJson += chunk;
                        })
                        .on('end', function () {
                            _parseStatus(rawJson, function (err, value) {
                                _logger.info('[jenkinsGrabber] jenkins status: %s', value);
                                callback(err, value);
                            });
                        });
                })
                .on('error', function (err) {
                    callback('[jenkinsGrabber] ' + err, STATUS.UNDEFINED);
                });
        }
    };

    /**
     * @param {Function} logger
     */
    var setLogger = function (logger) {
        _logger = logger;
    };

    return {
        STATUS: STATUS,
        getStatus: getStatus,
        setLogger: setLogger
    };
};
