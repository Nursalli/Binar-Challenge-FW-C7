## Setup

create a file named `sequelize-cli.config.json` in root folder (this file is required if you are want to run sequelize migrations, seeders, etc). adjust the configuration by your own config.

Example:
```json
{
  "development": {
    "username": "username",
    "password": "pass",
    "database": "db_development",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "username",
    "password": "pass",
    "database": "db_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "username",
    "password": "pass",
    "database": "db_production",
    "host": "localhost",
    "dialect": "postgres"
  }
}
```

add `.env` file with this kind of format:

```
JWT_KEY = jsfgfjguwrg8783wgbjs849h2fu3cnsvh8wyr8fhwfvi2g225
DATABASE_NAME=try_sequelize
DATABASE_USERNAME=root
DATABASE_PASSWORD=somepw
DATABASE_HOST=localhost
DATABASE_TYPE=postgres
```

## How to run

```sh
$ npm install
$ npm run db:create
$ npm run db:migrate
$ npm run db:seed:all
$ npm run start
```
Login Access (localhost:3000):
Username: admin |
Password: admin123

Noted: Authorization not completed (like logout and check every page must be login before) but still work for login and you can access localhost:3000/dashboard for access dashboard without login :V
