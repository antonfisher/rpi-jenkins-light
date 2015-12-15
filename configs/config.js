'use strict';

module.exports = {
    interval: 5 * 1000,
    rpi: {
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
    },
    jenkins: {
        host: '10.0.0.1',
        port: '8080',
        view: 'JenkinsLight',
        demoMode: true
    }
};
