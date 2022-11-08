import Fastify from "fastify";
import cors from "@fastify/cors";
import { articlesRouter } from "./controllers/articles.controllers";

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.register(articlesRouter);

  await fastify.listen({ port: 3000, host: "0.0.0.0" });
}

main();
