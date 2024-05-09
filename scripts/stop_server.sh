#!/bin/bash
# Stop the running Fastify server
 
APP_NAME="yakit_asistani"

# Check if the application is running using PM2, and stop it if so
if pm2 list | grep -q "$APP_NAME"; then
    echo "Stopping the Fastify application..."
    pm2 stop "$APP_NAME" || echo "Failed to stop $APP_NAME with PM2."
else
    echo "No running instance of $APP_NAME found to stop."
fi
