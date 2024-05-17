import { join } from 'path';
import autoLoad from '@fastify/autoload';
import type { FastifyCorsOptions } from '@fastify/cors';
import fp from 'fastify-plugin';

export default fp<FastifyCorsOptions>(async (fastify, _) => {
  fastify.register(autoLoad, {
    dir: join(__dirname, '../routes'),
    prefix: '/api/v1',
  });
});
