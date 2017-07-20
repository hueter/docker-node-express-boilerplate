FROM node:8.2.0

MAINTAINER Michael Hueter <mthueter@gmail.com>

# add local user for security
RUN npm install pm2@2.5.0 --global

RUN groupadd -r nodejs \
   && useradd -m -r -g nodejs nodejs

USER nodejs

# copy local files into container, set working directory and user
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app
COPY . /home/nodejs/app

# Global installation for pm2 and prod installation for the rest
RUN npm install --production

EXPOSE 5000

CMD ["pm2-docker", "./config/process.yml"]
