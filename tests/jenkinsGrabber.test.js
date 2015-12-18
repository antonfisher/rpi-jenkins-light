'use strict';

var expect = require('expect.js');
var mockery = require('mockery');

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

        describe('prodution mode [bad jenkins config]', function () {
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
        });

        describe('prodution mode [fake jenkins response]', function () {
            var returnValuesIndex = 0;
            var returnValues = ['blue', 'red_anime', 'red'];

            beforeEach(function () {
                mockery.enable({
                    warnOnReplace: false,
                    warnOnUnregistered: false,
                    useCleanCache: true
                });

                mockery.registerMock('http', {
                    get: function (value, callback) {
                        var res = function () {
                            var self = this;
                            self.setEncoding = function () {
                                //--
                            };
                            self.on = function (event, eventCallback) {
                                if (event == 'data') {
                                    eventCallback(JSON.stringify({
                                        jobs: [{
                                            color: returnValues[returnValuesIndex++]
                                        }]
                                    }));
                                } else if (event == 'end') {
                                    eventCallback();
                                }
                                return self;
                            };
                            return self;
                        };

                        callback(new res());

                        return {
                            on: function () {
                                // ---
                            }
                        };
                    }
                });
            });

            afterEach(function () {
                mockery.disable();
            });

            it('should return "ok" if color is "blue"', function (done) {
                var jenkinsGrabber = require('../modules/jenkinsGrabber')(configUnreachable);

                jenkinsGrabber.getStatus(function (err, value) {
                    expect(err).to.be(null);
                    expect(value).to.be('ok');
                    done();
                });
            });

            it('should return "run" if color is "red_anime"', function (done) {
                var jenkinsGrabber = require('../modules/jenkinsGrabber')(configUnreachable);

                jenkinsGrabber.getStatus(function (err, value) {
                    expect(err).to.be(null);
                    expect(value).to.be('run');
                    done();
                });
            });

            it('should return "fail" if color is "red"', function (done) {
                var jenkinsGrabber = require('../modules/jenkinsGrabber')(configUnreachable);

                jenkinsGrabber.getStatus(function (err, value) {
                    expect(err).to.be(null);
                    expect(value).to.be('fail');
                    done();
                });
            });

            it('should skip jenkins error', function (done) {
                var jenkinsGrabber = require('../modules/jenkinsGrabber')(configUnreachable);

                jenkinsGrabber.getStatus(function (err, value) {
                    expect(err).to.be(null);
                    expect(value).to.be('undefined');
                    done();
                });
            });
        });
    });
});
