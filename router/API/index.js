//Third-Party Module
const express = require('express');
const routerAPI = express.Router();
const routerPlayerAuth = require('./router-player-auth'); 
const routerPlayerGame = require('./router-player-game'); 

routerAPI.use('/api/player', routerPlayerAuth);
routerAPI.use('/api/player/game', routerPlayerGame);

module.exports = { routerAPI }