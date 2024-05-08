#!/bin/bash
# Stop the running Fastify server
if pgrep -f "yakit_asistani" > /dev/null
then
  echo "Stopping existing Fastify server"
  pkill -f "yakit_asistani"
else
  echo "No Fastify server running"
fi


# install dependencies and build the project
cd /home/ec2-user/yakit-asistani
npm install -g pnpm
pnpm install
pnpm build