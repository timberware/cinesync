FROM node:22-alpine3.21 as build

WORKDIR "/cinesync-web"

COPY package.json .
COPY static static

FROM build AS dependencies

RUN npm install

FROM dependencies as builder

ARG API_HOST
ENV API_HOST ${API_HOST}

ARG PUBLIC_API_HOST
ENV PUBLIC_API_HOST ${PUBLIC_API_HOST}

COPY src src
COPY tsconfig.json .
COPY svelte.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY vite.config.ts .

RUN npm run build

FROM build AS release

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

COPY --from=dependencies /cinesync-web/node_modules /cinesync-web/node_modules
COPY --from=builder /cinesync-web/build /cinesync-web/build

CMD ["sh", "-c", "node ./build"]
