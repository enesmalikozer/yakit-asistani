// src/utils/tokenUtils.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import logger from './logger';
export const generateAccessToken = (
  fastify: FastifyRequest,
  reply: FastifyReply,
  payload: object,
) => {
  fastify.log.info('Generating access token', payload);

  const accessToken = generateToken(
    fastify,
    payload,
    process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  );
  reply.setCookie('accessToken', accessToken, {
    path: '/',
    httpOnly: true,
    secure: true,
  });
  return accessToken;
};

export const generateRefreshToken = (
  fastify: FastifyRequest,
  reply: FastifyReply,
  payload: object,
) => {
  const refreshToken = generateToken(
    fastify,
    payload,
    process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  );
  fastify.log.info('Generating refresh token', refreshToken);
  reply.setCookie('refreshToken', refreshToken, {
    path: '/',
    httpOnly: true,
    secure: true,
  });

  return refreshToken;
};

function generateToken(fastify: FastifyRequest, payload: object, expiresIn: string) {
  return fastify.jwt.sign(payload, {
    expiresIn,
  });
}

export const isTokenExpired = (fastify: FastifyRequest, token: string): boolean => {
  try {
    const decoded = fastify.jwt.decode(token) as { exp: number };

    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return true;
    }
    return false;
  } catch (e) {
    logger.error('Error while decoding token', e.message);
    return true;
  }
};
