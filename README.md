# BLOG IN TYPESCRIPT

## Descrição da aplicação

Este projeto é o backend de uma aplicação em TypeScript para a publicação de artigos - as quais podem ser de qualquer tipo - basta que o usuário se cadastre e publique seu artigo - escolhendo um título e editando o corpo do texto. 

Todo o armazenamento do banco de dados - seja de novos usuários ou artigos - é feito por meio do prisma. Por ser uma aplicação ainda em desenvolvimento - decidi trabalhar com o SQLite, pois assim eu consigo testar as funcionalidades de maneira rápida e sem o uso de muitos recusos. 

Tanto o sistema de cadastro, quanto de autenticação, são desenvolvidos por meio do bcrypt e jwt - pois dessa forma eu consigo, de maneira fácil e pouco verbosa, criar um sistema mais seguro para os usuários. 

## ferramentas de desenvolvimento

 - NodeJS
 - fastify
 - Typecript
 - Prisma com SQLite
 - JWT e bcrypt para autenticação e criptografia 
 - Zod para validação de dados

## instalando e executanto

 - Faça um clone do repositório em sua máquina por meio do "git clone"
 - acesse a pasta raiz e rode o comando "npm install" para instalar todas as dependências
 - Para executar o projeto rode o comando npm run dev
 - verifique as rodas e cadastre um usuário
 - Faça o login do usuário e salve o token para adicionar no bearer authentication
 - Acesse as rotas de artigos e comece a publicar todos os seus artigos

## Próximos passos

 - Configuração do prisma e construção de modelos - CONCLUÍDO
 - bcrypt e jwt para cadastro e autenticação de usuários - CONCLUÍDO
 - Operações de CRUD - CONCLUÍDO
 - Login e cadastro de usuários - CONCLUÍDO
 - Melhoria no sistema de exceções - PENDENTE
 - Melhoria na arquitera de código - PENDENTE
 - Melhoria na na rota de login - PENDENTE
 - Adição de novos recursos: {} - PENDENTE
