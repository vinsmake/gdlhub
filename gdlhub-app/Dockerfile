# gdlhub.app/Dockerfile
FROM node:22.13.1

WORKDIR /app

ARG MODE
ENV MODE=$MODE

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
