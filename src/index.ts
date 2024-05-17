import fastify from 'fastify';
import pino from 'pino';
import config from './config';
import logger from './helpers/logger';
import { healthCheck } from './helpers/utils';
import { auth, cors, error, formbody, helmet, i18n, multipart, ratelimit, redis } from './plugins';
import userRouter from './routes/user.router';

const startServer = async () => {
  try {
    const server = fastify({
      logger: pino({ level: 'debug' }),
    });
    server.register(auth);
    server.register(cors);
    server.register(error);
    server.register(formbody);
    server.register(helmet);
    server.register(i18n);
    server.register(multipart);
    server.register(ratelimit);
    server.register(redis);
    server.decorateRequest('redis', server.redis);
    server.register(userRouter, { prefix: config.apiPrefix });

    server.get('/', (_, reply) => {
      reply.send({ name: 'yakit-asistani', status: 'ok' });
    });
    server.get('/health', async (request, reply) => {
      try {
        await healthCheck();
        reply.status(200).send(`${request.i18n.t('healthy')} ${new Date().toISOString()}`);
      } catch (e) {
        request.log.error(`Failed health check at ${new Date().toISOString()} ${e.message}`);
        reply.status(500).send(`Failed health check at ${new Date().toISOString()} ${e.message}`);
      }
    });
    if (process.env.NODE_ENV === 'production') {
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () =>
          server.close().then((err) => {
            server.log.info(`close application on ${signal}`);
            process.exit(err ? 1 : 0);
          }),
        );
      }
    }

    server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
      if (err) throw err;
      server.log.info(`server listening on ${address}`);
      server.log.info(`server is running on ${process.env.NODE_ENV} mode2`);
    });
  } catch (e) {
    logger.error(e);
  }
};

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});

startServer();
