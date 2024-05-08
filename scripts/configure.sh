#!/bin/bash
# Navigate to the app's directory
cd /home/ec2-user/yakit-asistani

# Install any additional dependencies
npm install -g pnpm
pnpm install --production

# Set up environment variables (customize as needed)
export NODE_ENV=production
export PORT=3000

echo "Configuration complete"
