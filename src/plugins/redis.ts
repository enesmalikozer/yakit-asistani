import fastifyRedis, { FastifyRedis } from '@fastify/redis';
import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import Redis from 'ioredis';

const client = new Redis({
  host: process.env.UPSTASH_REDIS_URL,
  port: 6379,
  password: process.env.UPSTASH_REDIS_PASSWORD,
  tls: {
    rejectUnauthorized: false,
  },
});

declare module 'fastify' {
  interface FastifyRequest {
    redis: FastifyRedis;
  }
}

const redisPlugin: FastifyPluginCallback = (server, _, done) => {
  server.register(fastifyRedis, {
    client: client,
    closeClient: true,
  });

  server.addHook('onRequest', (request, _, done) => {
    request.redis = server.redis;
    done();
  });

  done();
};

export default fastifyPlugin(redisPlugin);
