# specify the node base image with your desired version node:<version>
FROM node:10

WORKDIR /app

COPY package.json /app
RUN npm i
RUN npm i pm2 -g
COPY . /app


CMD pm2 start app.js -l ./logs/server.txt  


# replace this with your application's default port
EXPOSE 3000