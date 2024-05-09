#!/bin/bash
# Fallback stop script by port number

PORT=3000  
PID=$(lsof -t -i:$PORT)

if [ -n "$PID" ]; then
  echo "Stopping process running on port $PORT (PID: $PID)"
  kill -9 $PID
else
  echo "No process running on port $PORT."
fi
