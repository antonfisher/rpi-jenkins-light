# Raspberry Pi Jenkins Light

[![Test Status](https://travis-ci.org/antonfisher/rpi-jenkins-light.svg)](https://travis-ci.org/antonfisher/rpi-jenkins-light)

![Parts unpackage](https://raw.githubusercontent.com/antonfisher/rpi-jenkins-light/docs/images/parts-unpackage.jpg)

## Installation
* SSH to _Raspberry Pi_
* Install NodeJs 5.x `$ curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -`
* Clone repository `$ git clone https://github.com/antonfisher/rpi-jenkins-light.git`
* `$ cd rpi-jenkins-light`
* `$ sudo su` (need for GPIO module)
* Install dependencies `$ npm install`.

## Configure
* `$ cd rpi-jenkins-light`
* Edit `configs/config.js` file
``` javascript
module.exports = {
    interval: 5 * 1000,             // jenkins requests interval
    rpi: {                          // Raspberry Pi sub-config
        gpio: {                     // GPIO [General Purpose Input Output] config
            color: { 
                red: 15,            // pin # for red color
                yellow: 11,         // pin # for yellow color
                green: 7            // pin # for green color
            },
            outputLevel: {
                on: true,  // 3v3   // led turn on output level
                off: false // 30v   // led turn off output level
            }
        }
    },
    jenkins: {                      // Jenkins sub-config
        host: '10.0.0.1',           
        port: '8080',
        view: 'JenkinsLight',       // http://localhost:8080:/view/%VIEW_NAME%/
        demoMode: true              // ignore jenkins config, turn on red-yellow-green lights
    }
};
```

### Pins map
![Pins](https://raw.githubusercontent.com/antonfisher/rpi-jenkins-light/docs/images/rpi-pins-schema.png)

[More about Pi's pins...](http://elinux.org/RPi_Low-level_peripherals)

## Run
* `$ cd rpi-jenkins-light`
* `$ sudo su` (need for GPIO module)
* `$ nodejs run.js`.

## Autorun
* `$ cd rpi-jenkins-light`
* `$ sudo su` (need for global modules)
* `npm install pm2 -g`
* `pm2 start run.js`
* `pm2 startup`
* `pm2 save`.

## Tests
* Use _NodeJs v5.x_
* `$ npm install --dev`
* `$ npm test`.

## ToDo
- [x] add travis button
- [x] configuration examples
- [x] test with jenkins mock
- [x] add docs images
- [ ] check full installation
- [ ] first release
- [ ] publish npm module
- [ ] add link to article

## License
Copyright (c) 2015 Anton Fisher <a.fschr@gmail.com>

MIT License. Free use and change.