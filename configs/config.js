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
                on: true,  // 3v3
                off: false // 0v
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
