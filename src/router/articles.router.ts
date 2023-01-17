import * as fs from "fs";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../plugins/authenticate";
import { hasRole } from "../plugins/hasRole";
import { logger } from "../log/logger";

/**
 * * Arquivo de rotas 
 * ! Necessário melhorias na rota update
 */

interface IdParam {
  id: string;
  type: string;
  coauthor: boolean;
  contribution: number;
}

enum TextTypes {
  Ciencia = "ciencia",
  Tecnologia = "tecnologia",
  Poesia = "poesia",
  Culinaria = "culinaria",
  Conto = "conto",
  Cronica = "cronica"
}

export async function articlesRouter(fastify: FastifyInstance) {
  // * rota principal para teste de servidor.
  fastify.get("/", async (request, reply) => {
    reply.send({
      message: "Welcome to application",
    });
  });

  // * retorna todos os artigos publicados no momento
  fastify.get("/article/all", async (request, reply) => {
    const article = await prisma.articles.findMany({
      orderBy: {
        title: "desc",
      },
    });

    if (article.length == 0) {
      throw new Error("Não há nenhum artigo publicado no momento");
    }

    reply.status(200).send({ content: article });
  });

  // * retorna o artigo por seu ID
  fastify.get<{ Params: IdParam }>("/article/:id", async (request, reply) => {
    const { id } = request.params;
    const getOneArticle = await prisma.articles.findUnique({
      where: {
        id: String(id),
      },
      select: {
        title: true,
        body: true,
      },
    });

    if (!getOneArticle) {
      throw new Error("Artigo não encontrado ou inexistente");
    }

    reply.status(201).send({ content: getOneArticle });
  });

  // * retorna os artigos por seu tipo;
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
        throw new Error("Nenhum artigo sobre esse tema foi encontrado");
      }

      reply.status(201).send({ content: allTypesArticles });

    }
  );

  // * responsável por fazer o download dos artigos por ID
  fastify.get<{ Params: IdParam }>(
    "/article/download/:id",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const findToDownload = await prisma.articles.findUnique({
        where: {
          id: String(id),
        },
        select: {
          title: true,
          body: true,
          createdAt: true,
        },
      });

      let data = JSON.stringify(findToDownload, null, 2);

      if (!findToDownload) {
        throw new Error("Nenhum artigo com este ID foi encontrado");
      }

      fs.writeFile(`${findToDownload.title}.txt`, data, (err) => {
        throw new Error("Ocorreu um erro ao baixar o arquivo");
      });

      reply.status(201).send({ sucess: "Arquivo txt baixado com sucesso" });
    }
  );


  /****************************************
   ****************************************
   ***           ROTA CREATE            ***
   ****************************************
   ****************************************/

  /**
   * * rota que posta novos artigos no banco de dados
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
        contribution: z.number({ required_error: "permite contribuidores?" }),
      });

      const { type, title, body, contribution } = addNewPostValidation.parse(
        request.body
      );


      try {
        const result = await prisma.articles.create({
          data: {
            type,
            title,
            body,
            contribution,
            authorId: request.user.id,
          },
        });
        reply.status(200).send({
          sucess: "Seu artigo foi publicado com sucesso",
          content: result,
        });
      } catch {
        reply.status(500).send({
          failed: "Erro ao publicar, verifique seus dados",
        });
      }
    }
  );

  /****************************************
   ****************************************
   ***           ROTA UPDATE            ***
   ****************************************
   ****************************************/
  /**
   * * rota que atualiza os artigos
   * ? essa rota tem alguns bugs - numerando:
   * ! 1 - só é possível editar uma única vez por ID
   * ! 2 - quando um usuário edita duas vezes seu id é duplicado no banco
   */
  fastify.put<{ Params: IdParam }>(
    "/article/update/:id",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const updatePostValidation = z.object({
        title: z.optional(z.string()),
        body: z.optional(z.string()),
      });

      const { title, body } = updatePostValidation.parse(request.body);

      let result = await prisma.articles.findUnique({
        where: {
          id,
        },
        select: {
          contribution: true,
          coauthor: true,
        },
      });

      if (
        result.contribution > 0 &&
        result.coauthor.length < result.contribution
      ) {
        await prisma.articles.update({
          where: {
            id,
          },

          data: {
            title,
            body,
            coauthor: {
              create: {
                userId: request.user.id,
              },
            },
          },
        });
        reply.status(200).send({
          sucess: "O artigo foi atualizado com sucesso",
          content: result,
        });
      } else {
        reply.status(401).send({
          failed: "O artigo excedeu o número de contribuidores",
        });
      }
    }
  );

  /****************************************
   ****************************************
   ***           ROTA DELETE            ***
   ****************************************
   ****************************************/
  // * rota que deleta os artigos publicados
  fastify.delete<{ Params: IdParam }>(
    "/article/delete/:id",
    { onRequest: [authenticate, hasRole(["admin", "moderador"])] },
    async (request) => {
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
