import { FastifyInstance } from 'fastify';
import * as controllers from '../controllers';
import { loginSchema, signupSchema } from '../schema';

async function userRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/login',
    schema: loginSchema,
    handler: controllers.login,
  });

  fastify.route({
    method: 'POST',
    url: '/register',
    schema: signupSchema,
    handler: controllers.signUp,
  });

  fastify.route({
    method: 'POST',
    url: '/logout',
    handler: controllers.logout,
    preHandler: fastify.authenticate,
  });

  fastify.route({
    method: 'GET',
    url: '/me',
    handler: controllers.me,
    preHandler: fastify.authenticate,
  });
}

export default userRouter;
