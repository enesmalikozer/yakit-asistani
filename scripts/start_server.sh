#!/bin/bash
# Start the Fastify server
cd /home/ec2-user/yakit-asistani

echo "Starting Fastify server"
nohup nnpm run start > server.log 2>&1 &

echo "Fastify server started successfully"
