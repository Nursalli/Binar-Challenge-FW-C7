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

//Use Middleware
//Built-in Middleware (For add Public Directory, JSON File and Parsing x-www-urlencoded)
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

//Flash Middleware
app.use(cookieParser('secret'));
app.use(
    session({
        // cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());

//Middleware Passport
const passportLocal = require('./lib/passport-local');
const passportJWT = require('./lib/passport-jwt');
app.use(passportLocal.initialize());
app.use(passportJWT.initialize());
app.use(passportLocal.session());

//Set View Engine EJS
app.set('view engine', 'ejs');

//Third-Party Middleware (For logger and Layouts)
app.use(morgan('dev'));
app.use(expressLayouts);

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

//API Router
const { routerPlayerAuth } = require('./router/API/router-player-auth');
const { routerPlayerGame } = require('./router/API/router-player-game');

app.use(routerPlayerAuth);
app.use(routerPlayerGame);

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
// 3. time (INT NOT NULL) Auto + 10/game
// 4. room_id (VARCHAR NOT NULL UNIQUE)
// 5. Pil1 (ENUM('R', 'S', 'P', 'Empty') DEFAULT 'Empty'
// 6. Pil1 (ENUM('R', 'S', 'P', 'Empty') DEFAULT 'Empty'
// 7. Pil1 (ENUM('R', 'S', 'P', 'Empty') DEFAULT 'Empty'
// 8. status_room (win/Lose/Empty)
// 9. score (INT NOT NULL)

// Alur Game:
// 1. User bikin room (input:name) -> pertama kali? -> tambah data history: id_user, time(0), room_id(name+5 angka random), status_room(empty), score(0) -> bukan -> update data history: room_id(name+5 angka random), status_room(empty)
// 2. Join game (/join)(input:name) -> cek apakah nama room ada + cek apakah nama room sdh di pake 2 user -> pertama kali? -> tambah data history: id_user, time(0), room_id(name -> copy dari nama yg sdh ada), score(0)
// 3. Game (play/room_id) -> cek apakah nama room ada + cek apakah room_id sdh 2 org yg pake + cek apakah player 1 sudah input pilihan? kalau belum -> player 2 input pilihan1, pilihan2, pilihan3 -> menunggu player 1 | kalau sdh -> player 2 input pilihan1, pilihan2, pilihan3 sekaligus kalkulasi hasil permainan (logic) + update score(menang: 10, kalah 0) + update time(player 1 dan 2 + 10) dan update status_room
// 4. cek hasil permain (play/room_id/hasil) -> menampilkan room_id, pilihan1, pilihan2, pilihan3, dan status_room