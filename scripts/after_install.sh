#!/bin/bash
# Navigate to the app's directory
cd /home/ec2-user/yakit-asistani

npm install -g pnpm
pnpm install --frozen-lockfile
pnpm run db:migrate
pnpm run db:push
pnpm run build

echo "Configuration complete"
