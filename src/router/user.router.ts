import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { compare, hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { authenticate } from "../plugins/authenticate";
import { hasRole } from "../plugins/hasRole";
import { logger } from "../log/logger";
import { sendMailConfirmation } from "../controllers/sendMailConfirmation.js";

interface IdParamUser {
  id: String;
}

enum RoleAccess {
  Membro = "membro",
  Admin = "admin",
  Moderator = "moderator",
}

export async function userRouter(fastify: FastifyInstance) {
  // * rota para testar se a autenticação está funcionando
  fastify.get(
    "/ne",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      return { user: request.user };
    }
  );

  // * router
  fastify.post("/user/signup", async (request, reply) => {
    const addNewUser = z.object({
      name: z.string({ required_error: "Name required" }),
      email: z.string({ required_error: "Email Required" }),
      password: z
        .string({ required_error: "Password Required" })
        .min(8, { message: "Password must be at least 8 characters" }),
    });

    const { name, email, password } = addNewUser.parse(request.body);

    const hash = hashSync(password, 10);

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser) {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
          admin: "membro",
        },
        select: {
          name: true,
        },
      });
      reply.status(201).send({
        success: "usuário criado com sucesso",
        content: newUser,
      });
      sendMailConfirmation()
      logger.info(`${newUser} criado com sucesso no banco de dados`);
    } else {
      reply.status(401).send({
        failed: "Verifique seus dados e tente novamente",
      });
    }
  });

  // ! rota responsável por fazer o login dos usuários
  fastify.post("/user/signin", (request, reply) => {
    const loginUserValidation = z.object({
      email: z.string({ required_error: "email é requerido para fazer login" }),
      password: z.string({
        required_error: "senha é requerido para fazer login",
      }),
    });

    const { email, password } = loginUserValidation.parse(request.body);

    const findUser = prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then((user) => {
        compare(password, user.password, (error, result) => {
          if (result) {
            const token = sign(
              {
                email: user.email,
                id: user.id,
                admin: user.admin,
              },
              process.env.TOKEN_KEY,
              {
                expiresIn: "2h",
              }
            );

            reply.status(201).send({
              sucess: "Login realizado com sucesso",
              token: token,
            });
            user.token = token;
          } else {
            reply.status(401).send({
              failed: "Erro o fazer o login, verifique seus dados",
            });
          }
        });
      });
  });

  // ! rota para atualizar e editar registro de usuários
  fastify.put<{ Params: IdParamUser }>(
    "/user/update/:id",
    { onRequest: [authenticate, hasRole(["admin"])] },
    async (request, reply) => {
      const { id } = request.params;
      const userUpdateValidation = z.object({
        admin: z.nativeEnum(RoleAccess),
      });

      const { admin } = userUpdateValidation.parse(request.body);

      const findUserForUpdate = await prisma.user.findUnique({
        where: {
          id: String(id),
        },
      });

      if (!findUserForUpdate) {
        reply.status(401).send({
          failed: "Membro não encontrado ou inexistente",
        });
      } else {
        const result = await prisma.user.update({
          where: {
            id: String(id),
          },
          data: {
            admin,
          },
        });
        reply.status(200).send({
          success: "O usuário foi atualizado com sucesso",
          content: result,
        });
      }
    }
  );

  // ! rota responsável por deletar usuários
  fastify.delete<{ Params: IdParamUser }>(
    "/user/delete/:id",
    { onRequest: [authenticate, hasRole(["admin"])] },
    async (request, reply) => {
      const { id } = request.params;

      const findUserForDelete = await prisma.user.findUnique({
        where: {
          id: String(id),
        },
      });

      if (!findUserForDelete) {
        reply.status(400).send({
          failed: "Usuário não encontrado ou inexistente",
        });
      } else {
        const userDelete = await prisma.user.delete({
          where: {
            id: String(id),
          },
        });
        reply.status(200).send({
          success: "O usuário foi deletado com sucesso",
          content: userDelete,
        });
      }
    }
  );
}
