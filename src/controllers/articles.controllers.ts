import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";

interface IdParam {
  id: string;
}

export async function articlesRouter(fastify: FastifyInstance) {
  fastify.get("/articles", async (request, reply) => {
    reply.send({
      message: "Servidor aberto",
    });
  });

  fastify.get("/all", async (request, reply) => {
    const article = await prisma.articles.findMany({
      orderBy: {
        title: "desc",
      },
    });

    return { article };
  });

  fastify.get<{ Params: IdParam }>("/article/:id", async (request, reply) => {
    const { id } = request.params;
    const getOneArticle = await prisma.articles.findUnique({
      where: {
        id: String(id),
      },
    });

    return { getOneArticle };
  });

  fastify.post("/article/post", async (request, reply) => {
    const addNewPost = z.object({
      title: z.string(),
      body: z.string(),
    });

    const { title, body } = addNewPost.parse(request.body);

    const result = await prisma.articles.create({
      data: {
        title,
        body,
      },
    });
    reply.status(200).send({
      sucess: "Artigo postado com sucess",
      content: result,
    });
  });

  fastify.put<{ Params: IdParam }>(
    "/articles/update/:id",
    async (request, reply) => {
      const { id } = request.params;
      const updatePost = z.object({
        title: z.string(),
        body: z.string(),
      });

      const { title, body } = updatePost.parse(request.body);

      const result = await prisma.articles.update({
        where: {
          id,
        },
        data: {
          title,
          body,
        },
      });
      reply.status(200).send({
        sucess: "Artigo atualizado com sucesso",
        content: result,
      });
    }
  );

  fastify.delete<{ Params: IdParam }>(
    "/article/delete/:id",
    async (request, reply) => {
      const { id } = request.params;
      const deletePost = await prisma.articles.delete({
        where: {
          id: String(id),
        },
      });
      return { deletePost };
    }
  );
}
