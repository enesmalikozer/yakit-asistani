#!/bin/bash
# Stop the running Fastify server
if pgrep -f "yakit_asistani" > /dev/null
then
  echo "Stopping existing Fastify server"
  pkill -f "yakit_asistani"
else
  echo "No Fastify server running"
fi


sudo apt-get install nodejs -y
sudo npm install forever -g

