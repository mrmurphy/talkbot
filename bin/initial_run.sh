#!/bin/bash
echo "Make sure to install node modules first!"
NODE_ENV=production pm2 start app.js --node-args="--harmony" -f --name "talkbot"
