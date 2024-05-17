import fp from 'fastify-plugin';

import type { FastifyFormbodyOptions } from '@fastify/formbody';
import formbody from '@fastify/formbody';

/**
 * @fastify/helmet enables the use of helmet in a Fastify application.
 *
 * @see https://github.com/fastify/fastify-helmet
 */
export default fp<FastifyFormbodyOptions>(async (fastify, opts) => {
  await fastify.register(formbody, {
    ...opts,
  });
});
