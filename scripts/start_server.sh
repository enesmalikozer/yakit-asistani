#!/bin/bash
# Start the Fastify server
cd /home/ec2-user/yakit-asistani

echo "Starting Fastify server"
sudo systemctl restart yakit.server


echo "Fastify server started successfully"
