### Dev
![Node.js CI](https://github.com/timberware/cinesync/actions/workflows/api_test.yml/badge.svg?branch=main&event=push)
![Node.js CI](https://github.com/timberware/cinesync/actions/workflows/format_lint.yml/badge.svg?branch=main&event=push)
![Node.js CI](https://github.com/timberware/cinesync/actions/workflows/cd-api.yml/badge.svg?branch=main)
![Node.js CI](https://github.com/timberware/cinesync/actions/workflows/cd-web.yml/badge.svg?branch=main)


[<img src="images/cinesync.png">](https://cinesync.me/)

## What is CineSync?

CineSync is a web application that allows movie enthusiasts to synchronize and share their personalized watchlists with friends or groups. This platform empowers users to curate and manage their movie preferences, exchange recommendations, and enjoy the magic of cinema as a cohesive community.

The target audience for CineSync would primarily consist of movie enthusiasts and individuals who enjoy watching films. The platform aims to cater to a diverse range of users with varying levels of interest in movies, from casual viewers to avid cinephiles.

## How can I run the app?

### Initial Setup

CineSync is intended to be run using [Nodejs](https://nodejs.org/en)'s latest stable version.

- `git clone https://github.com/chrispinkney/cinesync.git`
- `cd cinesync/api`
- `npm i`
- `npm run db:generate`
- `cd ../web`
- `npm i`

### Running Cinesync

- Backend & db:
  - `docker-compose --env-file ./api/.env up`
- Frontend:
  - `cd web`
  - `npm run dev`

### Frontend development

- You can run the full backend (API + DB) using docker, or just the db using docker and the api in CLI:
  - `db`: `docker-compose up --build db`, and the api with `cd api && npm run dev`
- The first time the db is started a migration needs to be applied: `npm run db:migrate`
  - This also needs to happen each time the schema file changes, followed by `npm run db:generate`
- To stop the containers: `docker-compose down`

Running the frontend:

- `cd web`
- `npm run dev`
