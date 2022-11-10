import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { compare, hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { authenticate } from "../plugins/authenticate";

export async function userController(fastify: FastifyInstance) {
  fastify.get(
    "/ne",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      return { user: request.user };
    }
  );


  fastify.post("/user/signup", async (request, reply) => {
    const addNewUser = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = addNewUser.parse(request.body);

    const hash = hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hash,
      },
    });
    return { newUser };
  });

  fastify.post("/user/signin", (request, reply) => {
    const loginUser = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = loginUser.parse(request.body);

    const result = prisma.user
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
            reply.send({
              failed: error,
            });
          }
        });
      });
  });
}
