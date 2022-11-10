import Fastify from "fastify";
import cors from "@fastify/cors";
import { articlesRouter } from "./controllers/articles.controllers";
import { userController } from "./controllers/user.controllers";
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
  fastify.register(userController);

  await fastify.listen({ port: 3000, host: "0.0.0.0" });
}

main();
