# kyc.strongnode.io 💻
Built with Node.js, Rest APIs with Express, Sequelize, MySQL, AWS & React.

##  Prerequisites
Here is all you need for local development:
- node (+npm) & yarn
- MySQL
- Localstack (AWS emulator for local development)

## How to develop on localhost

First of all, **clone this repository**.

## 🌐 Localstack (AWS emulator for local development)

Runnin localstack in Docker

    docker run --rm -it -p 4566:4566 -p 4571:4571 localstack/localstack

## 💽 MySQL
Application uses a MySQL database, so we need a instance on the localhost too.
You can get & run dockerized instance from here https://hub.docker.com/_/mysql

If you don't want to run MySQL in Docker, you can use a whole server distributions like MAMP (https://www.mamp.info/en/mac/).

## 💿 Backend
Backend is built with Node.JS along with Express.JS.

**Setuping backend**:

    cd <repo>/back
    yarn install 				// for BE, you can use "npm install" too

Then we need to **create our .env file from .env.sample** (eg.: below)

    APP_NAME = StrongNode.io
    AWS_ACCESS_KEY_ID =
    AWS_SECRET_ACCESS_KEY =
    AWS_REGION =
    HOST = localhost
    DB_USER =
    DB_PASSWORD =
    DB_NAME = kyc_db
    DB_DIALECT = mysql
    DB_POOL_MAX = 5
    DB_POOL_MIN = 0
    DB_POOL_ACQUIRE = 30000
    DB_POOL_IDLE = 10000
    TOKEN_SECRET = ae9e943d7853e70709d8ed594140e334403dfca25516ab2327e9c0ecfeace9ded2d0f9031f860f08dc4a3044e562d511f5a24d55b574ef530bd8e1571418c6c9


Fill all of the missing parameters in order to make your localhost BE run correctly.

## 📀 Frontend

Front-end is created with React.

Installation need to be run with yarn, eg: ⬇️

    cd <repo>/front
    yarn install


Then we need change URL address in fron/.env file to point it on our local BE.

