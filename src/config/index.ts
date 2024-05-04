import envSchema from 'env-schema'
import path from 'path'

export const awsConfig = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION,
}

export const awsBucketName = process.env.AWS_BUCKET_NAME
export const linkExpireTime = process.env.AWS_LINK_EXPIRE

export default function loadConfig(): void {
  const result = require('dotenv').config({
    path: path.join(__dirname, '..', '..', '.env'),
  })

  if (result.error) {
    throw new Error(result.error)
  }

  envSchema({
    data: result.parsed,
    schema: {
      type: 'object',
      properties: {
        NODE_ENV: {
          type: 'string',
          enum: ['development', 'testing', 'production'],
        },
        LOG_LEVEL: {
          type: 'string',
          enum: ['error', 'warn', 'info', 'debug'],
        },
        API_PORT: {
          type: 'string',
        },
        DATABASE_URL: {
          type: 'string',
        },
        APP_JWT_SECRET: {
          type: 'string',
        },
        APP_JWT_EXPIRES_IN: {
          type: 'string',
        },
      },
    },
  })
}
