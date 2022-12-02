/* import { prisma } from "../lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { resolve } from "path";
import sendMailService from "../services/sendMailService";

class SendMailController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const user = await prisma.user.findUnique({
      where: {
        email: request.user.email,
      },
    });

    if (!user) {
      return reply.status(400).send({
        failed: "usuário nao encontrado",
      });
    }

    const signMailAlreadySend = await prisma.user.findUnique({
        where: {
            email: request.user.email
        }
    })

    const signMail = resolve(
      __dirname,
      "...",
      "views",
      "emails",
      "signMail.hbs"
    );

    const variables = {
      name: user.name,
      email: user.email,
    };

    if(signMailAlreadySend) {
        variables.name = signMailAlreadySend.name
        await sendMailService.execute(user.email, variables, signMail)
    }
  }
}
 */