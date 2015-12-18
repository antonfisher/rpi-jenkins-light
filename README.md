# Raspberry Pi Jenkins light

[![Test Status](https://travis-ci.org/antonfisher/rpi-jenkins-light.svg)](https://travis-ci.org/antonfisher/rpi-jenkins-light)

## Instalation
* SSH to _Raspberry Pi_
* Install NodeJs 4.x `$ curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -`
* Clone repository `$ git clone ...`
* `$ cd rpi-jenkins-light`
* `$ sudo su` (need for GPIO module)
* Install dependencies `$ npm install`

## Run
* `$ sudo su` (need for GPIO module)
* `$ cd rpi-jenkins-light`
* `$ nodejs run.js`

## Autorun
* `$ sudo su` (need for GPIO module)
* `$ cd rpi-jenkins-light`
* `npm install pm2 -g`
* `pm2 start run.js`
* `pm2 startup`
* `pm2 save`

## Tests
* `$ npm install --dev`
* `$ npm test`


## ToDo
- [x] add travis button
- [ ] add images
- [ ] confuguration examples
- [ ] first release
- [ ] check full instalation
- [ ] test with jenkins mock
- [ ] publish npm module

## License
Copyright (c) 2015 Anton Fisher <a.fschr@gmail.com>

MIT License. Free use and change.
