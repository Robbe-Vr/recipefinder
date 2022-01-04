FROM node:latest

WORKDIR /home/node/app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g serve
RUN npm run build

ENTRYPOINT [ "serve", "-s", "build", "-p", "3000" ]