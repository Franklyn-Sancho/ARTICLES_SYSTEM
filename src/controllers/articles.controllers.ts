import * as fs from "fs";


export async function createLocalArticleToReadOffline(article) {
  let data = JSON.stringify(article, null, 2);

  fs.writeFile(`article.txt`, data, (err) => {
    if (err) throw err;
    console.log(`Artigo baixado com sucesso`);
  });
}
