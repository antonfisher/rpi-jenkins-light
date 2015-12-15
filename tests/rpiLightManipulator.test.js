'use strict';

var expect = require('expect.js');
var mockery = require('mockery');

var config = {
    gpio: {
        color: {
            red: 15,
            yellow: 11,
            green: 7
        },
        outputLevel: {
            on: false, // 0v
            off: true  // 3v3
        }
    }
};

describe('RpiLightManipulator', function () {
    beforeEach(function () {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        mockery.registerMock('rpi-gpio', {
            setup: function (callback) {
                if (callback) {
                    callback();
                }
            },
            write: function (color, state, callback) {
                if (callback) {
                    callback();
                }
            }
        });
    });

    afterEach(function () {
        mockery.disable();
    });

    it('should return configuration error', function () {
        expect(require('../modules/rpiLightManipulator')).to.throwException('pins configuration missed');
    });

    it('should have public methods and static values', function () {
        var rpiLightManipulator = require('../modules/rpiLightManipulator')(config);

        expect(rpiLightManipulator.setLogger).to.be.a('function');
        expect(rpiLightManipulator.setup).to.be.a('function');
        expect(rpiLightManipulator.turnOff).to.be.a('function');
        expect(rpiLightManipulator.turnOffAll).to.be.a('function');
        expect(rpiLightManipulator.turnOn).to.be.a('function');
        expect(rpiLightManipulator.turnOnBlinked).to.be.a('function');
        expect(rpiLightManipulator.COLORS).to.be.an('object');
    });

    describe('setLogger()', function () {
        it('custom logger function should be called', function () {
            var rpiLightManipulator = require('../modules/rpiLightManipulator')(config);
            var log = false;

            rpiLightManipulator.setLogger({
                debug: function () {
                    log = true;
                }
            });

            expect(rpiLightManipulator.turnOn).to.throwException('is not supported');

            expect(log).to.be.ok();
        });
    });

    describe('setup()', function () {
        it('empty');
    });

    describe('turnOff()', function () {
        it('empty');
    });

    describe('turnOffAll()', function () {
        it('empty');
    });

    describe('turnOn()', function () {
        it('should turn on green color', function (done) {
            mockery.registerMock('rpi-gpio', {
                setup: function (callback) {
                    if (callback) {
                        callback(null);
                    }
                },
                write: function (color, state, callback) {
                    if (state === config.gpio.outputLevel.on) {
                        expect(color).to.be(config.gpio.color.green);
                    } else {
                        expect([
                            config.gpio.color.red,
                            config.gpio.color.yellow
                        ]).to.contain(color);
                    }

                    if (callback) {
                        callback(null);
                    }
                }
            });

            var rpiLightManipulator = require('../modules/rpiLightManipulator')(config);

            rpiLightManipulator.turnOn(rpiLightManipulator.COLORS.GREEN, function (err) {
                expect(err).to.be(null);
                done();
            });
        });
    });

    describe('turnOnBlinked()', function () {
        it('should blink yellow color', function (done) {
            this.timeout(3000);

            var yellowWasOn = false;
            var yellowWasOff = false;

            mockery.registerMock('rpi-gpio', {
                setup: function (callback) {
                    if (callback) {
                        callback(null);
                    }
                },
                write: function (color, state, callback) {
                    if (color === config.gpio.color.yellow) {
                        if (!yellowWasOn && state === config.gpio.outputLevel.on) {
                            yellowWasOn = true;
                        }
                        if (!yellowWasOff && state === config.gpio.outputLevel.off) {
                            yellowWasOff = true;
                        }
                    } else {
                        expect([
                            config.gpio.color.green,
                            config.gpio.color.red
                        ]).to.contain(color);
                    }

                    if (callback) {
                        callback(null);
                    }
                }
            });

            var rpiLightManipulator = require('../modules/rpiLightManipulator')(config);

            rpiLightManipulator.turnOnBlinked(rpiLightManipulator.COLORS.YELLOW, function (err) {
                expect(err).to.be(null);

                setTimeout(function () {
                    rpiLightManipulator.turnOff(rpiLightManipulator.COLORS.YELLOW, function (offErr) {
                        expect(offErr).to.be(null);
                        expect(yellowWasOn).to.be.ok();
                        expect(yellowWasOff).to.be.ok();
                        done();
                    });
                }, 2500); // wait 2.5s for blinks
            });
        });
    });
});
