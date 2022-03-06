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

    cd <repo>/back
    yarn install 				// for BE, you can use "npm install" too

Then we need to **create our .env file from .env.sample** (eg.: below)

    APP_NAME = StrongNode.io
    AWS_ACCESS_KEY_ID =
    AWS_SECRET_ACCESS_KEY =
    AWS_REGION =
    AWS_LOCALSTACK_URL = http://localhost:4566          // used for localhost development
    HOST = localhost
	HOSTNAME_KYC = localhost:8000        // this var is being used for creating links that are beign sent via emails
    DB_USER =
    DB_PASSWORD =
    DB_NAME = kyc_db
    DB_DIALECT = mysql
    DB_POOL_MAX = 5
    DB_POOL_MIN = 0
    DB_POOL_ACQUIRE = 30000
    DB_POOL_IDLE = 10000
    TOKEN_SECRET = ae9e943d7853e70709d8ed594140e334403dfca25516ab2327e9c0ecfeace9ded2d0f9031f860f08dc4a3044e562d511f5a24d55b574ef530bd8e1571418c6c9

In case of running localstack instead of AWS servers, you need to pass value to AWS_LOCALSTACK_URL variable, otherwise if you're using AWS, keep this variable empty.

Fill all of the missing parameters in order to make your localhost BE run correctly.

## 📀 Frontend

Front-end is created with React.

Installation need to be run with yarn, eg: ⬇️

    cd <repo>/front
    yarn install


Then we need change URL address in front/.env file to point it on our local BE.<br><br>
**Example of front/.env file:**

```
# REACT_APP_BASE_URL=http://localhost:8080 # this is what local backend will use by default
REACT_APP_BASE_URL=http://localhost:8000
```


## 📀 Database seed (for new databases only)

 - Run backend with `node server.js`
 - Open this URL: http://localhost:8080/api/utils/refreshEmailTemplates
 	(replace http://localhost:8080 with your current backend URL)


# 🔫 Trouble shooting
List of issues I've faced on my MB Pro (15 inch).

## #1 Chrome redirects API calls from http to https
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


