FROM node:22-alpine3.21 as build

RUN apk update && apk add \
  openssl \
  && rm -rf /var/cache/apk/*

WORKDIR "/cinesync-api"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json .
COPY pnpm-lock.yaml .
COPY prisma prisma

FROM build AS dependencies

ARG DATABASE_URL

RUN pnpm i --frozen-lockfile
RUN pnpm install -g prisma
RUN pnpm run db:generate

# -------------------------------------
FROM dependencies as builder

COPY src src
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY nest-cli.json .

RUN pnpm run build

# -------------------------------------
FROM build AS release

COPY --from=dependencies /cinesync-api/node_modules /cinesync-api/node_modules
COPY --from=builder /cinesync-api/dist /cinesync-api/dist

CMD ["sh", "-c", "pnpm run start:prod"]
