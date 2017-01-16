FROM node:7

MAINTAINER Michael Hueter <mthueter@gmail.com>

COPY . /docker-node-express-boilerplate

WORKDIR /docker-node-express-boilerplate

# Global installation for server-runners
RUN npm install pm2@2.2.1 --global && \
    npm install --production

EXPOSE 5000
CMD ["pm2-docker", "./config/process.yml"]
