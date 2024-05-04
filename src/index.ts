import fastify from 'fastify'
import pino from 'pino'
import loadConfig from './config'
import { utils } from './helpers/utils'
import userRouter from './routes/user.router'
loadConfig()

const startServer = async () => {
  try {
    const server = fastify({
      logger: pino({ level: 'info' }),
    })
    server.register(require('@fastify/formbody'))
    server.register(require('@fastify/cors'))
    server.register(require('@fastify/helmet'))
    server.register(userRouter, { prefix: '/api/user' })
    server.setErrorHandler((error, request, reply) => {
      server.log.error(error)
    })
    server.get('/', (request, reply) => {
      reply.send({ name: 'yakit-asistani' })
    })
    server.get('/health', async (request, reply) => {
      try {
        await utils.healthCheck()
        reply
          .status(200)
          .send(`Success health check at ${new Date().toISOString()}`)
      } catch (e) {
        reply.status(500).send()
      }
    })
    if (process.env.NODE_ENV === 'production') {
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () =>
          server.close().then((err) => {
            console.log(`close application on ${signal}`)
            process.exit(err ? 1 : 0)
          }),
        )
      }
    }
    await server.listen({
      port: 8000,
      host: '0.0.0.0',
    })
  } catch (e) {
    console.error(e)
  }
}

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

startServer()