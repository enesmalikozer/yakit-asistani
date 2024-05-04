FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

RUN apk add --no-cache --virtual python

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm -g install pnpm

RUN pnpm i --frozen-lockfile

COPY . .

CMD pnpm run dev

