# Raspberry Pi Jenkins Light

[![Test Status](https://travis-ci.org/antonfisher/rpi-jenkins-light.svg)](https://travis-ci.org/antonfisher/rpi-jenkins-light)

![Demo](https://raw.githubusercontent.com/antonfisher/rpi-jenkins-light/docs/images/traffic-light-demo.gif)

__Note:__ this package was tested on Raspberry Pi 2.

Read [article about this project](http://antonfisher.com/posts/2016/01/05/make-raspberry-pi-jenkins-traffic-light/).

## Installation
* SSH to _Raspberry Pi_
* `$ sudo su` (need for install _Node.js_)
* Install NodeJs 5.x
    * Add repository `$ curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -`
    * Run `$ apt-get install nodejs`
* From _GitHub_ sources:
    * Clone repository: `$ git clone https://github.com/antonfisher/rpi-jenkins-light.git`
    * `$ cd rpi-jenkins-light`
    * Install dependencies: `$ npm install`
* From _NPM_:
    * `$ npm install rpi-jenkins-light`.

## Configure
Edit `$ vim configs/config.js` file:

``` javascript
module.exports = {
    rpi: {                          // Raspberry Pi sub-config
        gpio: {                     // GPIO [General Purpose Input Output] config
            color: {
                red: 15,            // pin # for red color
                yellow: 11,         // pin # for yellow color
                green: 7            // pin # for green color
            },
            outputLevel: {
                on: true,  // 3v3   // led turn on output level
                off: false // 0v    // led turn off output level
            }
        }
    },
    jenkins: {                      // Jenkins sub-config
        interval: 5 * 1000,         // requests interval
        host: '10.0.0.1',
        port: '8080',
        view: 'JenkinsLight',       // http://localhost:8080/view/%VIEW_NAME%/
        demoMode: true              // demo turn on red-yellow-green lights
    }
};
```

### Demo mode
To run light in demo mode set property: `demoMode: true` in `jenkins` section in `configs/config.js`.

### Connect LEDs to Raspberry Pi
Example config works with this configuration:
![LEDs connections](https://raw.githubusercontent.com/antonfisher/rpi-jenkins-light/docs/images/schema-simple.png)

### Pins map
![Pins](https://raw.githubusercontent.com/antonfisher/rpi-jenkins-light/docs/images/rpi-pins-schema.png)

[More about Pi's pins...](http://elinux.org/RPi_Low-level_peripherals)

### Final version
![Under hood 1](https://raw.githubusercontent.com/antonfisher/rpi-jenkins-light/docs/images/mounted-board.jpg)

![Under hood 2](https://raw.githubusercontent.com/antonfisher/rpi-jenkins-light/docs/images/light-before-close.jpg)

## Configure Jenkins
* Open _Jenkins_ main page
* Create new list view called `JenkinsLight`
* Add monitored tasks to this view.

The colors indicate (by priority):
* Blinks yellow -- at least one build is running
* Red -- at least one build is failed
* Green -- all builds are OK.

![Jenkins View](https://raw.githubusercontent.com/antonfisher/rpi-jenkins-light/docs/images/create-jenkins-view.png)

## Run
* `$ sudo su` (need for GPIO module)
* From _GitHub_ sources:
    * `$ node run.js`
* From _NPM_:
    * `$ node ./node_modules/rpi-jenkins-light/run.js`.

## Autorun application after reboot
* `$ sudo su` (need for global modules)
* `$ npm install pm2 -g`
* `$ pm2 startup`
* `$ pm2 start run.js`
* `$ pm2 save`.

## Tests
* Use _NodeJs v5.x_
* `$ npm install --dev`
* `$ npm test`.

## Release History
* 1.1.0 Tests and improvements
    * configuration examples
    * test with jenkins mock
* 1.0.0 Initial release.

## ToDo
- [x] add link to article
- [ ] npm global module

## License
Copyright (c) 2015 Anton Fisher <a.fschr@gmail.com>

MIT License. Free use and change.
