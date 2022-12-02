import Fastify from "fastify";
import cors from "@fastify/cors";
import { articlesRouter } from "./router/articles.router";
import { userRouter } from "./router/user.router";
import {controllers} from './controllers/sendMailController.js'
import jwt from "@fastify/jwt";


require("dotenv").config();

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: process.env.TOKEN_KEY,
  });

  fastify.register(articlesRouter);
  fastify.register(userRouter);
  fastify.register(controllers)

  await fastify.listen({ port: 3000, host: "0.0.0.0" });
}

main();
