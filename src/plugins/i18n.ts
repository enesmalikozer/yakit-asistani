import { FastifyPluginCallback } from 'fastify';
import i18n from 'fastify-i18n';
import fastifyPlugin from 'fastify-plugin';
import { locales } from '../locales';
const i18nPlugin: FastifyPluginCallback = (server, _, done) => {
  server.register(i18n, {
    fallbackLocale: 'tr',
    messages: locales,
  });

  done();
};

export default fastifyPlugin(i18nPlugin);
