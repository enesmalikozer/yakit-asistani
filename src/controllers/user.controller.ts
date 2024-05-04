import { FastifyReply } from 'fastify'
import * as JWT from 'jsonwebtoken'
import { ERROR400, STANDARD } from '../helpers/constants'
import { ERRORS, handleServerError } from '../helpers/errors'
import { prisma, utils } from '../helpers/utils'
import { IUserRequest } from '../interfaces'

export const login = async (request: IUserRequest, reply: FastifyReply) => {
  try {
    const { email, password } = request.body
    const user = await prisma.user.findUnique({ where: { email: email } })
    if (!user) {
      reply.code(ERROR400.statusCode).send(ERRORS.userNotExists)
    }
    const checkPass = await utils.compareHash(password, user?.password)
    if (!checkPass) {
      reply.code(ERROR400.statusCode).send(ERRORS.userCredError)
    }
    const token = JWT.sign(
      {
        id: user?.id,
        email: user?.email,
      },
      process.env.APP_JWT_SECRET ?? '',
    )
    reply.code(STANDARD.SUCCESS).send({
      token,
      user,
    })
  } catch (err) {
    handleServerError(reply, err)
  }
}

export const signUp = async (request: IUserRequest, reply: FastifyReply) => {
  try {
    const { email, password, name } = request.body
    const user = await prisma.user.findUnique({ where: { email: email } })
    if (user) {
      reply.code(409).send(ERRORS.userExists)
    }
    const hashPass = await utils.genSalt(10, password)
    const createUser = await prisma.user.create({
      data: {
        email,
        name,
        password: String(hashPass),
      },
    })

    const token = JWT.sign(
      {
        id: user?.id,
        email: user?.email,
      },
      process.env.APP_JWT_SECRET ?? '',
    )
    reply.code(STANDARD.SUCCESS).send({
      token,
      user: {
        ...createUser,
        password: undefined,
      },
    })
  } catch (err) {
    handleServerError(reply, err)
  }
}
