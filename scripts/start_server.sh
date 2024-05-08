#!/bin/bash
# Start the Fastify server
cd /home/ec2-user/yakit-asistani

npm install -g pnpm
pnpm install
pnpm build


echo "Starting Fastify server"
nohup node index.js > server.log 2>&1 &

echo "Fastify server started successfully"
