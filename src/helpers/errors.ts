import { FastifyReply } from 'fastify';

export enum ERRORS {
  invalidToken = 'invalid_token',
  userExists = 'user_exists',
  userNotExists = 'user_not_exists',
  userCredError = 'user_cred_error',
  tokenError = 'token_error',
}

export function handleServerError(reply: FastifyReply, error: Error) {
  reply.log.error(error);
  return reply.internalServerError();
}
