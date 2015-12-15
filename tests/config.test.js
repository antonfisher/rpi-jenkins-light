'use scrict';

var expect = require('expect.js');

describe('Config', function () {
    var config = require('../configs/config.js');

    it('should have key "interval"', function () {
        expect(config).to.have.key('interval');
    });

    it('should have key "rpi"', function () {
        expect(config).to.have.key('rpi');
        expect(config.rpi).to.have.key('gpio');
        expect(config.rpi.gpio).to.have.key('color');
        expect(config.rpi.gpio.color).to.have.keys(['red', 'yellow', 'red']);
        expect(config.rpi.gpio).to.have.key('outputLevel');
        expect(config.rpi.gpio.outputLevel).to.have.keys(['on', 'off']);
    });

    it('should have key "jenkins"', function () {
        expect(config).to.have.key('jenkins');
        expect(config.jenkins).to.not.only.have.keys(['host', 'post', 'view']);
    });
});
