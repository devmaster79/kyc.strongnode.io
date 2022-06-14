FROM node:14-alpine

COPY ./ /usr/src/app
WORKDIR /usr/src/app/blockchain
RUN apk add git;
RUN npm install
