#!/bin/bash

# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# source ~/.bashrc
# nvm install --lts

sudo yum update -y
sudo yum install -y nodejs npm

sudo npm install -g pnpm
sudo pnpm install --frozen-lockfile
sudo pnpm build
