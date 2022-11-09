import Fastify from "fastify";
import cors from "@fastify/cors";
import { articlesRouter } from "./controllers/articles.controllers";
import { userController } from "./controllers/user.controllers";

require('dotenv').config()

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.register(articlesRouter);
  fastify.register(userController)

  await fastify.listen({ port: 3000, host: "0.0.0.0" });
}

main();
