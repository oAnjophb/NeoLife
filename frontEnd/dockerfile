FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN yarn install --legacy-peer-deps

COPY . .

RUN yarn build

RUN yarn global add serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]