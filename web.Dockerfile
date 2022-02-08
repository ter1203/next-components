FROM node:14-alpine as build

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

COPY web/package.json ./web/package.json

RUN yarn install --pure-lockfile --non-interactive

COPY web/ ./web

FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/web /usr/src/app/web

EXPOSE 3000

WORKDIR /usr/src/app/web

ENV NODE_ENV=development

CMD ["yarn", "dev"]
