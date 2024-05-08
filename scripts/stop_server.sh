#!/bin/bash
# Stop the running Fastify server
if pgrep -f "yakit_asistani" > /dev/null
then
  echo "Stopping existing Fastify server"
  pkill -f "yakit_asistani"
else
  echo "No Fastify server running"
fi


curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install

