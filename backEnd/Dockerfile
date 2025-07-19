FROM node:20-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

FROM node:20-alpine
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=build /app/build ./build
COPY --from=build /app/pronto_socorro.db ./pronto_socorro.db

EXPOSE 3001

CMD ["node", "build/src/main.js"]