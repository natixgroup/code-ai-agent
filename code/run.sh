#!/bin/bash
. /home/mihamina/.aikeys
PATH="/home/rsync/node/bin:/home/rsync/code-ai-agent/code/node_modules/.bin:"${PATH}
cd /home/rsync/code-ai-agent/code
npm install
npm run build
npm run start

