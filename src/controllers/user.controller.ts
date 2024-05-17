import type { FastifyReply } from 'fastify';
import { ERRORS, handleServerError } from '../helpers/errors';
import { generateAccessToken, generateRefreshToken } from '../helpers/token';
import { compareHash, genSalt, prisma } from '../helpers/utils';
import type { IUserRequest } from '../interfaces';

export const login = async (request: IUserRequest, reply: FastifyReply) => {
  try {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      reply.badRequest(request.i18n.t(ERRORS.userNotExists));
      return;
    }
    request.log.info('User found');
    request.log.info(user);
    const checkPass = await compareHash(user.password, password);
    if (!checkPass) {
      request.log.error(checkPass, request.i18n.t(ERRORS.userCredError));
      reply.badRequest(request.i18n.t(ERRORS.userCredError));
      return;
    }
    const accessToken = generateAccessToken(request, reply, {
      ...user,
      password: undefined,
    });
    const refreshToken = generateRefreshToken(request, reply, {
      ...user,
      password: undefined,
    });

    reply.setCookie('access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
    });
    reply.setCookie('refresh_token', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: true,
    });
    request.redis.set(user.email, accessToken);
    reply.code(200).send({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const signUp = async (request: IUserRequest, reply: FastifyReply) => {
  try {
    const { email, password, name } = request.body;
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (user) {
      reply.log.error(ERRORS.userExists);
      reply.badRequest(request.i18n.t(ERRORS.userExists));
    }
    const hashPass = await genSalt(10, password);
    const createUser = await prisma.user.create({
      data: {
        email,
        name,
        password: String(hashPass),
      },
    });

    const token = request.jwt.sign({ ...user });
    reply.setCookie('access_token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
    });

    reply.log.info('User created successfully', {
      user: createUser,
      token,
    });
    reply.code(200).send({
      token,
      user: {
        ...createUser,
        password: undefined,
      },
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const logout = async (request: IUserRequest, reply: FastifyReply) => {
  try {
    request.redis.del(request.user.email);
    await reply.clearCookie('access_token');
    await reply.clearCookie('refresh_token');
    reply.code(200).send();
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const me = async (request: IUserRequest, reply: FastifyReply) => {
  try {
    const user = request.user;
    if (!user) {
      reply.badRequest(request.i18n.t(ERRORS.userNotExists));
    } else reply.code(200).send(user);
  } catch (err) {
    handleServerError(reply, err);
  }
};
