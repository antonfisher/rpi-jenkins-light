'use strict';

var expect = require('expect.js');

var configUnreachable = {
    view: 'kokoko',
    port: '1234'     // unreachable port
};

var configBadPort = {
    view: 'kokoko',
    port: '-'       // bad port formar
};

var configDemoMode = {
    view: 'kokoko',
    demoMode: true
};

describe('JenkinsGrabber', function () {
    it('should return configuration error', function () {
        expect(require('../modules/jenkinsGrabber')).to.throwException('view config missed');
    });

    it('should have public methods and static values', function () {
        var jenkinsGrabber = require('../modules/jenkinsGrabber')(configUnreachable);

        expect(jenkinsGrabber.getStatus).to.be.a('function');
        expect(jenkinsGrabber.setLogger).to.be.a('function');
        expect(jenkinsGrabber.STATUS).to.be.an('object');
    });

    describe('setLogger()', function () {
        it('custom logger function should be called', function () {
            var jenkinsGrabber = require('../modules/jenkinsGrabber')(configUnreachable);
            var log = false;

            jenkinsGrabber.setLogger({
                info: function () {
                    log = true;
                }
            });

            expect(jenkinsGrabber.getStatus).to.throwException('callback parameter missed');
            expect(log).to.be.ok();
        });
    });

    describe('getStatus()', function () {
        describe('demo mode', function () {
            var jenkinsGrabber = require('../modules/jenkinsGrabber')(configDemoMode);

            it('OK', function (done) {
                jenkinsGrabber.getStatus(function (err, value) {
                    expect(value).to.be(jenkinsGrabber.STATUS.OK);
                    done();
                });
            });

            it('RUN', function (done) {
                jenkinsGrabber.getStatus(function (err, value) {
                    expect(value).to.be(jenkinsGrabber.STATUS.RUN);
                    done();
                });
            });

            it('FAIL', function (done) {
                jenkinsGrabber.getStatus(function (err, value) {
                    expect(value).to.be(jenkinsGrabber.STATUS.FAIL);
                    done();
                });
            });

            it('UNDEFINED', function (done) {
                jenkinsGrabber.getStatus(function (err, value) {
                    expect(value).to.be(jenkinsGrabber.STATUS.UNDEFINED);
                    done();
                });
            });
        });

        describe('prodution mode', function () {

            it('wrong format port request failed', function () {
                var jenkinsGrabber = require('../modules/jenkinsGrabber')(configBadPort);
                expect(jenkinsGrabber.getStatus).withArgs(function () {}).to.throwException('port should be');
            });

            it('unreachable port request failed', function (done) {
                var jenkinsGrabber = require('../modules/jenkinsGrabber')(configUnreachable);

                jenkinsGrabber.getStatus(function (err) {
                    expect(err).to.contain('ECONNREFUSED');
                    done();
                });
            });

            it('should return value properly');
        });
    });
});
