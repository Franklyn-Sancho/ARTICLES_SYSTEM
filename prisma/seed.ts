import { PrismaClient } from "@prisma/client";


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

  const articles = await prisma.articles.create({
    data: {
      title: "Artigo de teste",
      body: "Corpo de um artigo de teste para saber se está sendo adicionado corretamente no BD"
    }
  })
}

main()
