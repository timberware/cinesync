FROM node:20-alpine3.17 as build

WORKDIR "/cinesync"

COPY package.json .
COPY prisma prisma

FROM build AS dependencies

ARG DATABASE_URL

RUN npm install
RUN npm install -g prisma
RUN npm run db:generate

# -------------------------------------
FROM dependencies as builder

COPY src src
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY nest-cli.json .

RUN npm run build

# -------------------------------------
FROM build AS release

COPY --from=dependencies /cinesync/node_modules /cinesync/node_modules
COPY --from=builder /cinesync/dist /cinesync/dist

CMD ["sh", "-c", "npm run start:prod"]
