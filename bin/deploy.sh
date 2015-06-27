#!/bin/bash
rsync -rav --exclude=".git" --exclude="node_modules" -e ssh . root@$DEPLOY_HOST:/var/www/talkbot
ssh root@$DEPLOY_HOST 'cd /var/www/talkbot && npm install && pm2 restart talkbot'
