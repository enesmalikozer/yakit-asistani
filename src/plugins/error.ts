import sensible from '@fastify/sensible';
import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const errorPlugin: FastifyPluginCallback = (server, _, done) => {
  server.register(sensible, {
    sharedSchemaId: 'HttpError',
  });

  done();
};

export default fastifyPlugin(errorPlugin);
