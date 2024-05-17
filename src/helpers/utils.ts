import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import logger from './logger';

export const prisma = new PrismaClient();

export const isJSON = (data: string) => {
  try {
    JSON.parse(data);
  } catch (e) {
    logger.error(e);
    return false;
  }
  return true;
};
export const getTime = () => {
  const date = new Date();
  const time = date.getTime();
  return time;
};

export const genSalt = (saltRounds, value) => {
  return new Promise((resolve, reject) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    bcrypt.hash(value, salt, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

export const healthCheck = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    prisma.$queryRaw`SELECT 1`
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const compareHash = async (hash, value) => {
  return bcrypt.compare(value, hash);
};
