# build stage
FROM node:20.5 as build-stage

RUN npm i -g pnpm@8.4.0

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY src/ ./src
COPY test/ ./test

RUN pnpm build

RUN pnpm prune --prod

# production stage
FROM node:20.5-alpine as production-stage

WORKDIR /usr/src/app

COPY --from=build-stage /app/package.json /usr/src/app
COPY --from=build-stage /app/node_modules /usr/src/app/node_modules
COPY --from=build-stage /app/dist /usr/src/app/dist

EXPOSE 3000
