import { Prisma, User } from '@prisma/client';
import { FastifyRequest } from 'fastify';

export interface IUserRequest extends FastifyRequest {
  body: Prisma.UserCreateInput;
  user: User;
}

export interface IUserAuthToken {
  id: number;
  email: string;
}

export interface IGetPresign {
  fileName: string;
}

export interface IPutPresign {
  userId: number;
  fileName: string;
}
