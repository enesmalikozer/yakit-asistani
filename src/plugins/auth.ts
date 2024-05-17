import fCookie from '@fastify/cookie';
import fastifyJwt, { FastifyJWT, JWT } from '@fastify/jwt';
import { User } from '@prisma/client';
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { generateAccessToken, isTokenExpired } from '../helpers/token';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => void;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: User;
  }
}

const authPlugin: FastifyPluginCallback = (server, _, done) => {
  server.register(fastifyJwt, { secret: process.env.JWT_SECRET as string });
  server.register(fCookie, {
    secret: process.env.JWT_SECRET as string,
    hook: 'preHandler',
  });
  server.addHook('preHandler', (req, _, next) => {
    req.jwt = server.jwt;
    return next();
  });

  server.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    const requestToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.headers['x-refresh-token'];
    const decoded = req.jwt.verify<FastifyJWT['user']>(requestToken as string);
    if (!requestToken) {
      return reply.unauthorized('unauthorized');
    }

    if (!refreshToken) {
      return reply.unauthorized('no_refresh_token');
    }

    if (isTokenExpired(req, refreshToken as string)) {
      return reply.unauthorized('token_expired');
    }

    const token = await req.redis.get(decoded.email);
    if (token !== requestToken) {
      return reply.unauthorized(req.i18n.t('invalid_token'));
    }
    req.log.info('token', token, req.cookies);

    if (isTokenExpired(req, token)) {
      const user = req.jwt.verify<FastifyJWT['user']>(refreshToken as string);
      const newToken = generateAccessToken(req, reply, user);
      reply.setCookie('access_token', newToken, {
        path: '/',
        httpOnly: true,
        secure: true,
      });

      req.redis.set(user.email, newToken);
    } else {
      req.user = decoded;
    }
  });

  done();
};

export default fastifyPlugin(authPlugin);
