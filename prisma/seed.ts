import { PrismaClient } from "@prisma/client";
import { userController } from "../src/router/user.router";

const prisma = new PrismaClient();

async function main() {
  /* const especie = await prisma.especie.create({
    data: {
      name: "cachorro",
      reino: "tigre",
      filo: "tigre",
      classe: "tigre",
      infraclasse: "tigre",
      ordem: "tigre",
      familia: "tigre",
      genero: "tigre",
      especie: "tigre",
    },
  }); */

  const user = await prisma.user.create({
    data: {
      email: "clarinha@email.com",
      password: "12345",
      admin: "true"
    },
  });

  const article = await prisma.articles.create({
    data: {
      title: "um artigo de teste",
      body: "A parte textual de um artigo de teste",
      userId: user.id,
      createdAt: "2022-11-10T16:56:05.622Z"
    }
  })

  /* const articles = await prisma.articles.create{}; */
}

main();
