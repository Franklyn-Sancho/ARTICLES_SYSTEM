import { prisma } from "../lib/prisma";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { authenticate } from "../plugins/authenticate";
import { hasRole } from "../plugins/hasRole";
import { createLocalArticleToReadOffline } from "../controllers/articles.controllers";

/**
 * * Nesse arquivo nós temos as rotas de artigos da aplicação
 * ! São necessárias diversas melhorias e aprimoramentos
 * TODO: melhorias nas exceções
 * TODO: implementar validação de tipos textuais
 * ? seria interessante adicionar co-autor?
 * ?
 */

interface IdParam {
  id: string;
  type: string;
}

enum TextTypes {
  Ciencia = "ciencia",
  Tecnologia = "tecnologia",
  Poesia = "poesia",
  Culinaria = "culinaria",
  Conto = "conto",
}

export async function articlesRouter(fastify: FastifyInstance) {
  // ! rota main para teste de servidor.
  fastify.get("/", async (request, reply) => {
    reply.send({
      message: "Welcome do application server",
    });
  });

  // ! rota que retornar todos os artigos publicados.
  fastify.get("/article/all", async (request, reply) => {
    const article = await prisma.articles.findMany({
      orderBy: {
        title: "desc",
      },
    });

    if (article.length == 0) {
      reply.status(401).send({
        failed: "Nenhum artigo foi públicado :(",
      });
    } else {
      reply.status(201).send({
        sucess: "Esses são os artigos publicados até o momento",
        content: article,
      });
    }
  });

  // ! rota que retorna um artigo pelo seu id.
  fastify.get<{ Params: IdParam }>("/article/:id", async (request, reply) => {
    const { id } = request.params;
    const getOneArticle = await prisma.articles.findUnique({
      where: {
        id: String(id),
      },
      select: {
        title: true,
        body: true,
      }
    });

    if (!getOneArticle) {
      reply.status(401).send({
        failed: "Artigo não encontrado ou inexistente",
      });
    } else {
      reply.status(201).send({
        content: getOneArticle,
      });
      
    }
  });

  // * rota responsável por retornar os artigos por seus tipos
  fastify.get<{ Params: IdParam }>(
    "/article/types/:type",
    async (request, reply) => {
      const { type } = request.params;
      const allTypesArticles = await prisma.articles.findMany({
        where: {
          type: String(type),
        },
        orderBy: {
          title: "desc",
        },
      });

      if (allTypesArticles.length > 0) {
        reply.status(201).send({
          success: `Retornando todos os artigos sobre ${type}`,
          content: allTypesArticles,
        });
      } else {
        reply.status(400).send({
          failed:
            "Infelizmente, nenhum artigo sobre este tema foi encontrado :(",
        });
      }
    }
  );

  /**
   * * rota responsável por postar novos artigos no servidor
   * ! modificar o autor para um dado não sensível
   */
  fastify.post(
    "/article/newpost",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const addNewPostValidation = z.object({
        type: z.nativeEnum(TextTypes),
        title: z.string({ required_error: "Title Required" }),
        body: z.string({ required_error: "Body Required" }),
      });

      const { type, title, body } = addNewPostValidation.parse(request.body);

      const result = await prisma.articles.create({
        data: {
          type,
          title,
          body,
          userId: request.user.id,
        },
      });
      reply.status(200).send({
        sucess: "Parabéns! Seu artigo foi publicado com sucesso",
        content: result,
      });
    }
  );

  // * update post
  fastify.put<{ Params: IdParam }>(
    "/article/update/:id",
    { onRequest: [authenticate, hasRole(["admin", "moderator"])] },
    async (request, reply) => {
      const { id } = request.params;
      const updatePostValidation = z.object({
        title: z.string(),
        body: z.string(),
      });

      const { title, body } = updatePostValidation.parse(request.body);

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
        sucess: "Post Successfully Updated",
        content: result,
      });
    }
  );

  // ! rota responsável por deletar os artigos já públicados.
  fastify.delete<{ Params: IdParam }>(
    "/article/delete/:id",
    { onRequest: [authenticate, hasRole(["admin", "moderador"])] },
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
