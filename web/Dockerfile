FROM node:24-alpine3.24 as build

WORKDIR "/cinesync-web"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

COPY package.json .
COPY pnpm-lock.yaml .
COPY static static

FROM build AS dependencies

RUN pnpm i --frozen-lockfile

FROM dependencies as builder

ARG API_HOST
ENV API_HOST ${API_HOST}

ARG PUBLIC_API_HOST
ENV PUBLIC_API_HOST ${PUBLIC_API_HOST}

COPY src src
COPY tsconfig.json .
COPY svelte.config.js .
COPY vite.config.ts .

RUN pnpm run build

FROM build AS release

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

COPY --from=dependencies /cinesync-web/node_modules /cinesync-web/node_modules
COPY --from=builder /cinesync-web/build /cinesync-web/build

CMD ["sh", "-c", "node ./build"]
