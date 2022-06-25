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
SESSION_SECRET = secret
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
## Web Page (Authenticated By Passport-Local) 
```
Login Access (localhost:3000):
Username: admin |
Password: admin123
```

## API (Authenticated By Passport-jwt)
```
1. Open your postman
2. Import API (file from directory file_export_postman/Binar Challenge Chapter 7.postman_collection.json) to your postman
3. After import you can:
    - register
    - login 
    - create-room (with tokenUser), 1 user can create more than 1 room and automated join with roomId was created
    - join (with tokenUser and roomId), user can join if roomId is available (only for 2 player) 
    - play (with tokenUser and roomId), user can input 3 option ('R': Rock, 'S': Scissor, 'P': Paper)
    - see game result (with tokenUser roomId), game result with user option, opponent option (if opponent already input option), result (if user and opponent already input option), and score ('Win': 100, 'Draw': 0)/battle option x 3
```