# kyc.strongnode.io 💻
Built with Node.js, Rest APIs with Express, Sequelize, MySQL, AWS & React.

##  Prerequisites
Here is all you need for local development:
- node (+npm) & yarn
- MySQL
- Localstack (AWS emulator for local development)
- AWS CLI

## How to develop on localhost

First of all, **clone this repository**.

## 🌐 Localstack (AWS emulator for local development)

This is required for testing emails.

```bash
cd <repo>/docker/
docker-compose -f localstack.docker-compose.yaml up -d
```

## 💽 MySQL
Application uses a MySQL database, so we need a instance on the localhost too.
You can get & run dockerized instance from here https://hub.docker.com/_/mysql

If you don't want to run MySQL in Docker, you can use a whole server distributions like MAMP (https://www.mamp.info/en/mac/).

Create MySQL database that we will add to .env later on. (default DB name: kyc_db)

Example:
```sh
docker run --name kyc-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_USER=kyc -e MYSQL_PASSWORD=kyc -e MYSQL_DATABASE=kyc_db -d mysql:latest
```

## 💽 Migrations (database updates)
In order to have our DB "versioned" we are using Sequelize migrations.

Migrations folder is located at `back/app/migrations`, every database change is stored in a separate .js file.

**Migrations are being run at every application start**, you can see the code in `back/app/models/index.js:19`.

###
**New migration can be created by typing** ⬇️ (or by manually creating file in migrations folder)

```
cd back/app/migrations
npx sequelize-cli migration:create --name modify_users_add_new_fields
```

Unfortunately, the content file it generates we need to override, because we are using Umzug library for handling migrations.
We need to have the following migration content ⬇️

```
const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
	await queryInterface.createTable('users', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: false
		},
		updatedAt: {
			type: Sequelize.DATE,
			allowNull: false
		}
	});
}

async function down({ context: queryInterface }) {
	await queryInterface.dropTable('users');
}

module.exports = { up, down };
```

Besides auto-migration on app start we can use the `back/app/scripts/run-migration.js` script. It supports 2 type of arguments ⬇️

```
cd back/app/scripts
node run-migrations.js up         // runs the migrations
node run-migrations.js down       // reverts all migrations
node run-migrations.js down --2   // reverts the last 2 migrations
```

## 💿 Backend
Backend is built with Node.JS along with Express.JS.

**Setuping backend**:

 - cd <repo>/back
 - npm install
 - cp .env.sample .env
 - Read carefully and edit .env

## 📀 AWS seed

 - Run db (with probably `docker container start kyc-db`)
 - Run localstack with `docker-compose -f localstack.docker-compose.yaml up`
	(from the `<repo>/docker` directory)
 - Run backend with `npm start`
	(from the `<repo>/back` directory)
 - Wait at least 10seconds.
 - Open this URL: http://localhost:8080/api/utils/refreshEmailTemplates
 	(replace http://localhost:8080 with your current backend URL)


## 📀 Frontend

Front-end is created with React.

Installation need to be run with yarn, eg: ⬇️

    cd <repo>/front
    yarn install


Then create your own `front/.env` based on `front/.env.sample`.

	npm start

And you will be able to access the frontend by `https://localhost:3000`

# 🔫 Trouble shooting

## #1 Windows
If you are using windows, please don't. But if you really want to use windows, you have to understand the key differences of the unix and windows shells.
For example, backend's `npm start` will probably not work for you. Because it sets the env like this: `NODE_ENV=development ts-node src/server.ts`
But windows would like to see something like this:

	set NODE_ENV=development
	node_modules/.bin/ts-node src/server.ts

This issue will be solved when all services get containerized.

## #2 Chrome redirects API calls from http to https
For some reason - Chrome, Firefox & Safari is redirecting API calls from FE to force use https (secured connection)
There are multiple solutions:
- remove domain from HSTS in Chrome (https://www.thesslstore.com/blog/clear-hsts-settings-chrome-firefox/)
- run Chrome with --disable-web-security flag

Second option worked for me.<br><br>


Running chrome with --disable-web-security flag
```
// Mac OS
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

// Linux
google-chrome --disable-web-security

// For windows, create a new desktop shortcut with the target below
"[PATH_TO_CHROME]\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp
```


