import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "clarinha",
      email: "clarinha@email.com",
      password: "12345",
      admin: "true",
    },
  });

  const article = await prisma.articles.create({
    data: {
      title: "um artigo de teste",
      body: "A parte textual de um artigo de teste",
      authorId: user.id,
      createdAt: "2022-11-10T16:56:05.622Z",
      
    },
  });
}

main();
