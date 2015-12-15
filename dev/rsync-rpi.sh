#!/usr/bin/env bash

if [[ -z $1 ]]; then
    echo -e "Usage: $ ./rsync-rpi.sh pi@10.0.0.151:js/rpi-jenkins-light";
    exit;
fi;

while sleep 2; do
    rsync -va ../run.js ../package.json ../modules ../configs $1;
done;
