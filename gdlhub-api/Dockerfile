# gdlhub.api/Dockerfile
FROM node:22.13.1

WORKDIR /app

ARG MODE
ENV MODE=$MODE

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
