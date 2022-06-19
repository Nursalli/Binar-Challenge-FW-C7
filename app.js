//Third-Party Module
const express = require('express');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
require('dotenv').config();

//Init Express and Assignment Const Port
const app = express();
const port = 3000;

//Set View Engine EJS
app.set('view engine', 'ejs');

//Third-Party Middleware (For logger and Layouts)
app.use(morgan('dev'));
app.use(expressLayouts);

//Use Middleware
//Built-in Middleware (For add Public Directory, JSON File and Parsing x-www-urlencoded)
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

//Flash Middleware
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
app.use(flash());

//Middleware Login
const { verifyToken } = require('./middleware/verify');

//Setup Method Override
app.use(methodOverride('_method'));

//Web Page Router
const { routerLogin } = require('./router/router-login');
const { routerDashboard } = require('./router/router-dashboard');
const { routerDataUsers } = require('./router/router-data-users');
const { routerBiodataUsers } = require('./router/router-biodata-users');
const { routerHistoryUsers } = require('./router/router-history-users');

app.use('/', routerLogin);
app.use('/dashboard', routerDashboard);
app.use('/dashboard/data-users', routerDataUsers);
app.use('/dashboard/biodata-users', routerBiodataUsers);
app.use('/dashboard/history-users', routerHistoryUsers);

//Error Handling Middleware (Internal Server Error)
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: "Fail",
        errors: err.message
    });
});

//Error Handling Middleware (404 Handler)
app.use((req, res, next) => {
    res.status(404).json({
        errors: "API Not Found"
    });
});

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});

//Plan Database

//1 to 1 user_game -> user_game_biodata
//1 to N user_game -> user_game_history

// User_games:
// 1. id (INT NOT NULL AUTO_INCREMENT)
// 2. username (VARCHAR(100) NOT NULL UNIQUE)
// 3. password (VARCHAR(100) NOT NULL)
// 4. user_token (VARCHAR(100))
// 5. role (ENUM('Super User', 'User') NOT NULL DEFAULT 'User')

// User_game_biodata:
// 1. id (INT NOT NULL AUTO_INCREMENT)
// 2. id_user (INT NOT NULL FOREIGN KEY UNIQUE)
// 3. name (VARCHAR(100) NOT NULL)
// 4. email (VARCHAR(100) NOT NULL)
// 5. birthdate (DATE NOT NULL)
// 6. country (VARCHAR(100) NULL DEFAULT 'Indonesia')

// User_game_histories:
// 1. id (INT NOT NULL AUTO_INCREMENT)
// 2. id_user (INT NOT NULL FOREIGN KEY)
// 3. time (INT NOT NULL)
// 4. score (INT NOT NULL)
