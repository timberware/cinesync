FROM node:lts-alpine as build

WORKDIR "/cinesync-web"

COPY package.json .
COPY package-lock.json .
COPY .env .
COPY static static

FROM build AS dependencies

RUN npm install

FROM dependencies as builder

COPY src src
COPY tsconfig.json .
COPY svelte.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY vite.config.ts .

RUN npm run build

FROM build AS release

COPY --from=dependencies /cinesync-web/node_modules /cinesync-web/node_modules
COPY --from=builder /cinesync-web/build /cinesync-web/build

CMD ["sh", "-c", "ORIGIN=http://localhost:3000 PORT=3000 node build"]