![Logo](https://storage.googleapis.com/needs-bucket/Logo%20Amoure.png)

--------------------

<h1 align="center">Amoure Backend</h1>

<div align="center">

![Node.js](https://img.shields.io/badge/-Node.js-05122A?style=flat&logo=node.js)&nbsp;
![Express.js](https://img.shields.io/badge/-Express.js-05122A?style=flat&logo=express)&nbsp;
![Typescript](https://img.shields.io/badge/-Typescript-05122A?style=flat&logo=typescript)&nbsp;
![Prisma](https://img.shields.io/badge/-Prisma-05122A?style=flat&logo=prisma)&nbsp;
![Zod](https://img.shields.io/badge/-Zod-05122A?style=flat&logo=zod)&nbsp;
![JWT](https://img.shields.io/badge/-JWT-05122A?style=flat&logo=auth0)&nbsp;
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-05122A?style=flat&logo=postgresql)&nbsp;
![Docker](https://img.shields.io/badge/-Docker-05122A?style=flat&logo=docker)&nbsp;
![Postman](https://img.shields.io/badge/-Postman-05122A?style=flat&logo=postman)&nbsp;
![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-05122A?style=flat&logo=githubactions)&nbsp;
![Google Cloud Platform Service](https://img.shields.io/badge/-Google%20Cloud%20Platform%20Service-05122A?style=flat&logo=googlecloud)&nbsp;

</div>

--------------------

## Entity Relationship Diagram
![ERD](https://storage.googleapis.com/needs-bucket/ERD%20Amoure.png)

-----

## Cloud Computing Diagram
![Cloud Computing Diagram](https://storage.googleapis.com/needs-bucket/Cloud%20Architecture%20and%20Backend%20Tools%20Amoure.png)

-----

## Running Application on Localhost
1. `cd` to repository's root
2. Make a env file `.env`
3. Fill the file `.env` referring to `env.example`, make sure to include the correct endpoint for the other services
4. Open terminal and run `docker compose up -d`
5. Run `npx prisma db seed` or alternatively `pnpm run prisma:seed` from the docker terminal
